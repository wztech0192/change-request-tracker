'use strict';

/**
 * @author Wei Zheng
 * @description create, read, update, and delete for change requests
 */

const ChangeRequest = use('App/Models/ChangeRequest/ChangeRequest');
const User = use('App/Models/User');
const ChangeRequestMessage = use(
  'App/Models/ChangeRequest/ChangeRequestMessage'
);
const ChangeRequestHistory = use(
  'App/Models/ChangeRequest/ChangeRequestHistory'
);
const AuthorizationService = use('App/Service/AuthorizationService');
const CrudService = use('App/Service/CrudService');

class ChangeRequestController {
  /**
   * display change request detail
   * @returns {ChangeRequest}
   */
  async detail({ auth, params }) {
    const user = await auth.getUser();
    const changeRequest = await ChangeRequest.find(params.id);

    //only allow dev, admin, and request submitter to receive the data
    AuthorizationService.verifyPermission(
      changeRequest,
      user,
      ['Developer', 'Admin'],
      true
    );

    changeRequest.client = await changeRequest.user().fetch();
    return changeRequest;
  }

  /**
   * Get all change request belongs to this user
   * @returns {ChangeRequest[]}
   */
  async index({ auth, request }) {
    const user = await auth.getUser();
    const { tab } = request.all();

    switch (tab) {
      case 'all':
        return await user.change_requests().fetch();
      case 'active':
        //return all change request except the one with cancelled or complete status
        return await user
          .change_requests()
          .whereNotIn('status', ['Cancelled', 'Complete'])
          .fetch();

      default:
        return await user
          .change_requests()
          .where('status', tab)
          .fetch();
    }
  }

  /**
   * Get change request list by filter
   * @returns {ChangeRequest[]}
   */
  async getRequestList({ auth, request }) {
    const user = await auth.getUser();
    AuthorizationService.verifyRole(user, ['Developer', 'Admin']);
    const filter = request.all();
    let requestList;
    //    console.log(filter);
    //filter by type
    if (filter.method === 'tab') {
      switch (filter.tab) {
        case 'all':
          requestList = await ChangeRequest.all();
          break;
        case 'active':
          //return all change request except the one with cancelled or complete status
          requestList = await ChangeRequest.query()
            .whereNotIn('status', ['Cancelled', 'Complete'])
            .fetch();
          break;
        default:
          requestList = await ChangeRequest.query()
            .where('status', filter.tab)
            .fetch();
          break;
      }
    } else {
      if (filter.id) {
        requestList = await ChangeRequest.find(filter.id);
      } else {
        const query = ChangeRequest.query();
        query.where('status', 'like', `%${filter.status || ''}%`);
        if (filter.clientsName) {
          //if data has clients name, query all clients
          query.whereIn('clientName', filter.clientsName);
        }
        if (filter.date) {
          //if data has date range, query date range
          query.whereBetween('created_at', filter.date.split('/'));
        }
        requestList = await query.fetch();
      }
    }

    //if requestList is not a array, arraylize it.
    return requestList.rows ? requestList : [requestList];
  }

  /**
   * Create a change request
   * @returns {ChangeRequest}
   */
  async create({ auth, request }) {
    const data = request.only(['title', 'details']);

    //throw error if title or details is empty
    if (!data.title || !data.details) {
      throw new Exception('Something is wrong');
    }

    let { message, client } = request.only(['message', 'client']);
    const user = await auth.getUser();
    //get client if current user is a admin. Else client is current user.
    if (user.role === 'Admin' || user.role === 'Developer') {
      client = await User.find(client);
      if (!client) {
        throw new Exception('Something is wrong');
      }
    } else {
      client = user;
    }

    const changeRequest = new ChangeRequest();
    data.totalMessage = 0;
    data.totalHistory = 0;
    data.clientName = client.full_name;
    //fill in data then save to its creator
    changeRequest.fill(data);

    await client.change_requests().save(changeRequest);

    //save change request message is message exist
    if (message) {
      // replace < and > to html code &#60; and &#62 for security
      message = message.replace(/([\<])/g, '&#60;');
      message = message.replace(/([\>])/g, '&#62');
      var crmsg = new ChangeRequestMessage();
      crmsg.fill({
        content: `<p>${message}</p>`,
        user_id: user.id,
        senderEmail: user.email,
        senderName: user.full_name
      });
      changeRequest.messages().save(crmsg);
      changeRequest.totalMessage++;
    }
    //create change request history
    this._createCRHistory(
      changeRequest,
      'Create',
      `Change Request ID ${changeRequest.id} has been posted by ${
        user.full_name
      } in ${changeRequest.created_at}`
    );

    return changeRequest;
  }

  /**
   * delete target change request
   * @returns {ChangeRequest}
   */
  async destroy({ auth, params }) {
    return CrudService.destroy(auth, params, ChangeRequest, {
      verify: (user, changeRequest) =>
        AuthorizationService.verifyPermission(changeRequest, user, [
          'Developer',
          'Admin'
        ])
    });
  }

  /**
   * delete target change request
   * @returns {ChangeRequest}
   */
  async update({ auth, request, params }) {
    const requestData = request.only(['title', 'details', 'status']);
    return CrudService.update(auth, params, ChangeRequest, {
      verify: (user, changeRequest) =>
        AuthorizationService.verifyPermission(
          changeRequest,
          user,
          ['Developer', 'Admin'],
          true
        ),
      work: changeRequest => changeRequest.merge(requestData),
      after: (changeRequest, user) => {
        let type, content;
        // history for status update
        if (requestData.status) {
          type = `New Status: ${requestData.status.toUpperCase()}`;
          content = `The status has been updated to ${requestData.status.toUpperCase()} by ${
            user.full_name
          }`;
        } else {
          //history for content modify
          type = 'Edit Content';
          content = `Change Request Content has been modified by ${
            user.full_name
          }`;
        }
        //create change request history
        this._createCRHistory(changeRequest, type, content);
      }
    });
  }

  /**
   * Get all messages belongs to this change request
   * @returns {ChangeRequestMessage[]}
   */
  async getCRMessage({ auth, params }) {
    const user = await auth.getUser();
    const changeRequest = await ChangeRequest.find(params.id);
    AuthorizationService.verifyPermission(
      changeRequest,
      user,
      ['Developer', 'Admin'],
      true
    );
    const message = await ChangeRequestMessage.query()
      .where('change_request_id', changeRequest.id)
      .orderBy('created_at', 'desc')
      .limit(params.num)
      .fetch();
    return message;
  }

  /**
   * Create a change request message
   * @returns {ChangeRequest}
   */
  async createCRMessage({ auth, request, params }) {
    const data = request.only('content');
    const change_request = await ChangeRequest.find(params.id);

    return await CrudService.create(auth, ChangeRequestMessage, {
      verify: user =>
        AuthorizationService.verifyPermission(
          change_request,
          user,
          ['Developer', 'Admin'],
          true
        ),
      work: async (message, user) => {
        //fill in data then save to its owner
        data.user_id = user.id;
        data.senderEmail = user.email;
        data.senderName = user.full_name;
        message.fill(data);
        await change_request.messages().save(message);
        change_request.totalMessage++;
        change_request.save();
      }
    });
  }

  /**
   * delete target change request message
   * @returns {ChangeRequestMessage}
   */
  async destroyCRMessage({ auth, params }) {
    return CrudService.destroy(auth, params, ChangeRequestMessage, {
      verify: (user, message) =>
        AuthorizationService.verifyPermission(
          message,
          user,
          ['Developer', 'Admin'],
          true
        )
    });
  }

  /**
   * delete target change request message
   * @returns {ChangeRequestMessage}
   */
  async updateCRMessage({ auth, request, params }) {
    return CrudService.update(auth, params, ChangeRequestMessage, {
      verify: (user, message) =>
        AuthorizationService.verifyPermission(
          message,
          user,
          ['Developer', 'Admin'],
          true
        ),
      work: message => message.merge(request.only('content'))
    });
  }

  /**
   * private method to save history of change request
   */
  _createCRHistory(changeRequest, type, content) {
    var crHistory = new ChangeRequestHistory();
    crHistory.fill({ type, content });
    changeRequest.histories().save(crHistory);
    changeRequest.totalHistory++;
    changeRequest.save();
  }

  /**
   * Get all histories belongs to this change request
   * @returns {ChangeRequestMessage[]}
   */
  async getCRHistory({ auth, params }) {
    const user = await auth.getUser();
    const changeRequest = await ChangeRequest.find(params.id);
    AuthorizationService.verifyPermission(
      changeRequest,
      user,
      ['Developer', 'Admin'],
      true
    );
    let histories = await ChangeRequestHistory.query()
      .where('change_request_id', changeRequest.id)
      .orderBy('created_at', 'desc')
      .fetch();
    return histories;
  }

  /**
   * delete target change request message
   * @returns {ChartJS JSON}
   */
  async getChartData({ auth, params }) {
    const user = await auth.getUser();
    AuthorizationService.verifyRole(user, ['Developer', 'Admin']);
    const dateRange = params.range.split('~');

    //retrieve change request between required date
    const CRList = await ChangeRequest.query()
      .whereBetween('created_at', [
        `${dateRange[0]} 00:00:01`,
        `${dateRange[1]} 23:59:59`
      ])
      .orderBy('created_at', 'asc')
      .fetch();

    //chart data JSON format
    const chartData = {
      pie: [0, 0, 0, 0],
      line: [
        new Array(7).fill(0),
        new Array(7).fill(0),
        new Array(7).fill(0),
        new Array(7).fill(0)
      ]
    };

    let total = 0;
    let i = 0;

    //loop through each change request and fill chart data.
    for (let data of CRList.rows) {
      //if date is different change to filling data to next day

      switch (data.status) {
        case 'Cancelled':
          i = 0;
          break;
        case 'To Do':
          i = 1;
          break;
        case 'In Progress':
          i = 2;
          break;
        case 'Complete':
          i = 3;
          break;
      }
      chartData.pie[i]++;
      chartData.line[i][data.created_at.getDay()]++;
      total++;
    }

    return {
      chartData,
      total
    };
  }

  /**
   * Adjust change request data, for dev
   */
  async adjustChangeRequest({ auth }) {
    const user = await auth.getUser();
    AuthorizationService.verifyRole(user, ['Developer']);
    const CRList = await ChangeRequest.all();

    for (let cr of CRList.rows) {
      cr.totalHistory = await cr.histories().getCount();
      cr.totalMessage = await cr.messages().getCount();
      let client = await cr.user().fetch();
      cr.clientName = `${client.full_name}`;
      cr.save();
    }
  }

  /**
   * gennerate dummy change request, for dev
   */
  async generateChangeRequest({ auth, params }) {
    const user = await auth.getUser();
    AuthorizationService.verifyRole(user, ['Developer']);
    let users = await User.all();
    users = users.rows;
    let randUser = null;
    for (let i = 0; i < params.num; i++) {
      randUser = users[Math.round(Math.random() * (users.length - 1))];

      const changeRequest = new ChangeRequest();
      //fill in data then save to its creator
      changeRequest.fill({
        totalMessage: 0,
        totalHistory: 0,
        clientName: `${randUser.full_name}`,
        title: 'This is random generated change request #' + i,
        details: 'g.'
      });

      await randUser.change_requests().save(changeRequest);
      //create change request history
      this._createCRHistory(
        changeRequest,
        'Create',
        `Change Request ID ${changeRequest.id} has been posted by ${
          user.full_name
        } in ${changeRequest.created_at}`
      );
    }
  }
}

module.exports = ChangeRequestController;
