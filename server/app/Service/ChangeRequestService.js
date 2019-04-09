'use strict';

/**
 * @author Wei Zheng
 * @description handle all change request related function
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
  /**
   * declare services that used in this service
   */
  constructor(flagService) {
    this.flagService = flagService;
    this.notificationService = new NotificationService();
  }

  /**
   * display change request detail
   * @return {ChangeRequest}
   * @param {int} userID the current user id
   * @param {int} id target change request id
   */
  async getDetail(userID, id) {
    //get change request from database, return null if not exist
    const changeRequest = await ChangeRequest.find(id);
    if (!changeRequest) return null;
    //check if this change request is flagged
    changeRequest.isFlag = await this.flagService.isFlag(changeRequest, userID);
    return changeRequest;
  }

  /**
   * Get all change request belongs to this user
   * @return {ChangeRequest[]}
   * @param {int} id current user id
   * @param {String} tab used to filter change request
   */
  getUserRequest(id, tab) {
    switch (tab) {
      case 'all':
      case 'All':
        //return all change request owned by this id
        return ChangeRequest.queryForOwned(id);
      case 'active':
      case 'Active':
        //return all change request except the one with cancelled or complete status
        return ChangeRequest.queryForActive(id);
      default:
        //return change requests with status matching the tab string
        return ChangeRequest.queryByStatus(tab, id);
    }
  }

  /**
   * Get change request list by filter
   * @return {ChangeRequest[]}
   * @param {Object} filter { tab, method, id, status, clientsName, date }
   */
  async getRequestList(filter) {
    let requestList;
    //filter by type
    if (filter.method === 'tab') {
      // if filter by tab
      switch (filter.tab) {
        case 'all':
        case 'All':
          //return all change requests
          requestList = await ChangeRequest.all();
          break;
        case 'active':
        case 'Active':
          //return all change request except the one with cancelled or complete status
          requestList = await ChangeRequest.queryForActive();
          break;
        default:
          //return all change request with status matching the tab string
          requestList = await ChangeRequest.queryByStatus(filter.tab);
          break;
      }
    } else {
      // filter by input search data
      if (filter.id) {
        // if there is a id return change request by id
        requestList = await ChangeRequest.find(filter.id);
      } else {
        // return filtered change request list
        requestList = await ChangeRequest.queryForSearch(filter);
      }
    }
    // if result list is null, return empty array
    if (requestList === null) {
      return [];
    } else {
      //else if requestList is not a array, arraylize it.
      return requestList.rows ? requestList : [requestList];
    }
  }

  /**
   * get client from request data
   * @return {User}
   * @param {User} user
   * @param {String} client client email
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
   * update target change request
   * @return {ChangeRequest}
   * @param {int} id
   * @param {Object} requestData { title, details, status }
   * @param {User} user
   */
  async updateRequest(id, requestData, user) {
    // find change requet, if null return null
    const changeRequest = await ChangeRequest.find(id);
    if (!changeRequest) return null;

    //validate request status format, return null if failed
    if (
      requestData.status &&
      requestData.status !== 'Cancelled' &&
      requestData.status !== 'To Do' &&
      requestData.status !== 'In Progress' &&
      requestData.status !== 'Complete'
    ) {
      return null;
    }
    //update change request data
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
    // save change request changes
    await changeRequest.save();
    return changeRequest;
  }

  /**
   * search change request
   * @return {Object}
   * @param {Object} data { term, page }
   * @param {String} target
   */
  async searchRequest(data, target) {
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
   * @return {ChangeRequest}
   * @param {Object} data change request data
   * @param {User} client the user who owns this change request
   * @param {User} issuer the user who submit this change request
   * @param {String} message change request message
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
    //notify all admins for a new change request created
    this.notificationService.newChangeRequest(changeRequest);
    //save change request message is message exist
    if (message) {
      await this.createCRMessage(issuer, changeRequest, message, true);
    }
    return changeRequest;
  }

  /**
   * create message for target change request
   * @return {ChangeRequestMessage}
   * @param {User} user current user
   * @param {ChangeRequest} changeRequest target change request
   * @param {String} content message content
   * @param {Boolean} sanitize boolean value to deside if sanitize the content
   */
  async createCRMessage(user, changeRequest, content, sanitize) {
    if (sanitize) {
      // replace < and > to html code &#60; and &#62 to prevent html script attack
      content = `<p>${MapHelper.sanitize(content)}</p>`;
    }
    const msg = await ChangeRequestMessage.create({
      change_request_id: changeRequest.id,
      content: content,
      user_id: user.id,
      senderEmail: user.email,
      senderName: user.full_name
    });
    //increase total message by one and save changes
    changeRequest.totalMessage++;
    await changeRequest.save();
    return msg;
  }

  /**
   * create a history for target change request
   * @return {ChangeRequest}
   * @param {ChangeRequest} changeRequest
   * @param {Object} data { type, content } change request history data
   */
  async createCRHistory(changeRequest, data) {
    //set fk id
    data.change_request_id = changeRequest.id;
    await ChangeRequestHistory.create(data);
    //increase total history by one and save changes
    changeRequest.totalHistory++;
    await changeRequest.save();
  }

  /**
   * Get change request by id
   * @return {ChangeRequest}
   * @param {int} id change request id
   */
  getChangeRequest(id) {
    return ChangeRequest.find(id);
  }

  /**
   * Get all messages belongs to target change request
   * @return {ChangeRequestMessage[]}
   * @param {ChangeRequest} changeRequest
   * @param {int} limit
   */
  getCRMessage(changeRequest, limit) {
    return ChangeRequestMessage.queryForList(changeRequest.id, limit);
  }

  /**
   * Get all histories belongs to target change request
   * @return {ChangeRequestHistory[]}
   * @param {ChangeRequest} changeRequest
   */
  getCRHistory(changeRequest) {
    return ChangeRequestHistory.queryForList(changeRequest.id);
  }

  /**
   * get change request status ratio of selected week
   * @return {ChartJS JSON}
   * @param {String[]} dateRange [ startDate, endDate ]
   */
  async getChartData(dateRange) {
    //retrieve change request between required date
    const CRList = await ChangeRequest.queryByDateRange(dateRange);
    // return mapped chart data
    return MapHelper.mapChartDataFrom(CRList);
  }

  /**
   * create change request from email
   * @return {ChangeRequest}
   * @param {JSON} mailJSON
   * @param {User} client
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
   * @return {ChangeRequest || ChangeRequest[]}
   * @param {User} user
   * @param {String} subject type of request
   */
  emailTrack(user, subject) {
    //change request query
    return ChangeRequest.queryForEmail(user, subject);
  }

  /**
   * Adjust all change request data, for testing purpose only
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
}

module.exports = ChangeRequestService;
