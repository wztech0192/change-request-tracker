'use strict';

/**
 * @author Wei Zheng
 * @description handle change request method
 */

const ChangeRequest = use('App/Models/ChangeRequest/ChangeRequest');
const ChangeRequestHistory = use(
  'App/Models/ChangeRequest/ChangeRequestHistory'
);
const ChangeRequestMessage = use(
  'App/Models/ChangeRequest/ChangeRequestMessage'
);
const MapHelper = use('App/Helper/MapHelper');
const NotificationService = use('App/Service/NotificationService');
const User = use('App/Models/User');

class ChangeRequestService {
  constructor(flagService) {
    this.flagService = flagService;
    this.notificationService = new NotificationService();
  }

  /**
   * display change request detail
   * @returns {ChangeRequest}
   */
  async getDetail(user, id) {
    const changeRequest = await ChangeRequest.find(id);
    if (!changeRequest) return null;
    changeRequest.isFlag = await this.flagService.isFlag(
      changeRequest,
      user.id
    );
    return changeRequest;
  }

  /**
   * Get all change request belongs to this user
   * @returns {ChangeRequest[]}
   */
  getUserRequest({ id }, request) {
    const { tab } = request.only('tab');
    switch (tab) {
      case 'all':
      case 'All':
        return ChangeRequest.queryForOwned(id);
      case 'active':
      case 'Active':
        //return all change request except the one with cancelled or complete status
        return ChangeRequest.queryForActive(id);
      default:
        return ChangeRequest.queryByStatus(tab, id);
    }
  }

  /**
   * Get change request list by filter
   * @returns {ChangeRequest[]}
   */
  async getRequestList(request) {
    const filter = request.all();
    let requestList;
    //    console.log(filter);
    //filter by type
    if (filter.method === 'tab') {
      switch (filter.tab) {
        case 'all':
        case 'All':
          requestList = await ChangeRequest.all();
          break;
        case 'active':
        case 'Active':
          //return all change request except the one with cancelled or complete status
          requestList = await ChangeRequest.queryForActive();
          break;
        default:
          requestList = await ChangeRequest.queryByStatus(filter.tab);
          break;
      }
    } else {
      if (filter.id) {
        requestList = await ChangeRequest.find(filter.id);
      } else {
        requestList = await ChangeRequest.queryForSearch(filter);
      }
    }
    //if requestList is not a array, arraylize it.
    return requestList.rows ? requestList : [requestList];
  }

  /**
   * get client from submitted request data
   */
  getClientFrom(user, client) {
    //get client if current user is a admin. Else client is current user.
    if (user.role === 'Admin' || user.role === 'Developer') {
      return User.findBy('email', client);
    } else {
      return user;
    }
  }

  /**
   * delete target change request
   * @returns {ChangeRequest}
   */
  async updateRequest(id, request, user) {
    const changeRequest = await ChangeRequest.find(id);
    if (!changeRequest) return null;

    const requestData = request.only(['title', 'details', 'status']);

    //validate request status format
    if (
      requestData.status &&
      requestData.status !== 'Cancelled' &&
      requestData.status !== 'To Do' &&
      requestData.status !== 'In Progress' &&
      requestData.status !== 'Complete'
    ) {
      return null;
    }
    changeRequest.merge(requestData);
    //map history data
    const hist = MapHelper.mapCRHistory(requestData, user);
    //create change request history
    await this.createCRHistory(changeRequest, hist);
    //create notification
    this.notificationService.updateChangeRequest(
      changeRequest,
      hist.type,
      user.id
    );
    await changeRequest.save();
    return changeRequest;
  }

  /**
   * search change request
   */
  async searchRequest(request, target) {
    const data = request.all();
    const term = data.term || '';
    const list = await ChangeRequest.queryForPaginate(term, target, data.page);
    return {
      results: list.rows,
      pagination: {
        more: list.pages.page < list.pages.lastPage
      },
      totals: list.rows.length
    };
  }

  /**
   * Create a change request
   * @returns {ChangeRequest}
   */
  async createRequest(data, client, issuer, message) {
    //map change request using helper
    const changeRequest = MapHelper.mapChangeRequest(
      new ChangeRequest(),
      data,
      client
    );
    //increase client total request
    client.totalRequest++;
    client.save();
    await client.change_requests().save(changeRequest);

    //create change request history
    await this.createCRHistory(changeRequest, {
      type: 'Create',
      content: `Change Request ID ${changeRequest.id} has been posted by ${
        issuer ? issuer.full_name : client.full_name
      } in ${changeRequest.created_at}`
    });

    this.notificationService.newChangeRequest(changeRequest);

    //save change request message is message exist
    if (message) {
      // replace < and > to html code &#60; and &#62 for security
      message = MapHelper.sanitize(message);
      await this.createCRMessage(issuer, changeRequest, message, true);
    }

    return changeRequest;
  }

  /**
   * create message of change request
   */
  async createCRMessage(user, changeRequest, content, sanitize) {
    if (sanitize) {
      // replace < and > to html code &#60; and &#62 for security
      content = `<p>${MapHelper.sanitize(content)}</p>`;
    }
    const msg = await ChangeRequestMessage.create({
      change_request_id: changeRequest.id,
      content: content,
      user_id: user.id,
      senderEmail: user.email,
      senderName: user.full_name
    });
    changeRequest.totalMessage++;
    await changeRequest.save();
    return msg;
  }

  /**
   * create history of change request
   */
  async createCRHistory(changeRequest, data) {
    data.change_request_id = changeRequest.id;
    await ChangeRequestHistory.create(data);
    changeRequest.totalHistory++;
    await changeRequest.save();
  }

  /**
   * Adjust change request data, for dev
   */
  async adjustChangeRequest() {
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
   * Get change request
   * @returns {ChangeRequestMessage[]}
   */
  getChangeRequest(id) {
    return ChangeRequest.find(id);
  }

  /**
   * Get all messages belongs to this change request
   * @returns {ChangeRequestMessage[]}
   */
  getCRMessage(changeRequest, limit) {
    return ChangeRequestMessage.queryForList(changeRequest.id, limit);
  }

  /**
   * Get all histories belongs to this change request
   * @returns {ChangeRequestMessage[]}
   */
  getCRHistory(changeRequest) {
    return ChangeRequestHistory.queryForList(changeRequest.id);
  }

  /**
   * delete target change request message
   * @returns {ChartJS JSON}
   */
  async getChartData(params) {
    const dateRange = params.range.split('~');
    //retrieve change request between required date
    const CRList = await ChangeRequest.queryByDateRange(dateRange);
    // return mapped chart data
    return MapHelper.mapChartDataFrom(CRList);
  }

  /**
   * create change request from mail content
   */
  createFromMail(mailJSON, client) {
    return this.createRequest(
      {
        title: mailJSON['subject'],
        details: mailJSON['body-html'] || mailJSON['body-plain']
      },
      client
    );
  }

  /**
   * return change request content for email
   */
  emailTrack(user, subject) {
    //change request query
    return ChangeRequest.queryForEmail(user, subject);
  }
}

module.exports = ChangeRequestService;
