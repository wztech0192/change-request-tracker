'use strict';

/**
 * @author Wei Zheng
 * @description This controller serves as the entry & exist point to all change request related data.
 *              The controller uses ChangeRequestService, MailService, and FlagService
 *              to provide read, add, update, as well as other change request related features.
 */

const VerificationHelper = use('App/Helper/VerificationHelper');
const FlagService = use('App/Service/FlagService');
const MailService = use('App/Service/MailService');
const ChangeRequestService = use('App/Service/ChangeRequestService');

class ChangeRequestController {
  /**
   * declare services that used in this controller
   */
  constructor() {
    this.flagService = new FlagService();
    this.mailService = new MailService();
    this.crService = new ChangeRequestService(this.flagService);
  }

  /**
   * display selected change request information
   * @returns {ChangeRequest}
   */
  async detail({ auth, params }) {
    const user = await auth.getUser();
    // use service to retrieve change request
    const changeRequest = await this.crService.getDetail(user.id, params.id);
    //only allow dev, admin, and request submitter to receive the data
    VerificationHelper.verifyPermission(
      changeRequest,
      user,
      ['Developer', 'Admin'],
      true
    );
    return changeRequest;
  }

  /**
   * Get all change request belongs to the current user
   * @returns {ChangeRequest[]}
   */
  async index({ auth, request }) {
    const user = await auth.getUser();
    //gey tab from request
    const { tab } = request.only('tab');
    // use service to get request lists
    const list = await this.crService.getUserRequest(user.id, tab);
    return list;
  }

  /**
   * Get filtered change request list, admin only
   * @returns {ChangeRequest[]}
   */
  async getRequestList({ auth, request }) {
    const user = await auth.getUser();
    // verify if the user is admin
    VerificationHelper.verifyRole(user, ['Developer', 'Admin']);
    //get data from request
    const filter = request.all();
    // use service to get request lists
    const list = await this.crService.getRequestList(filter);
    return list;
  }

  /**
   * Create a change request
   * @returns {ChangeRequest}
   */
  async create({ auth, request }) {
    const data = request.only(['title', 'details']);
    //validate data, throw exceiption and return 404 if the title or details is empty
    VerificationHelper.verifyRequest(data, 'request');
    let { message, client } = request.only(['message', 'client']);
    const user = await auth.getUser();
    // use service to get information of request owner
    client = await this.crService.getClientFrom(user, client);
    //verify if request owner exist, if fail return 404
    VerificationHelper.verifyExistance(client);
    //use service to generate change request
    const result = await this.crService.createRequest(
      data,
      client,
      user,
      message
    );
    return result;
  }

  /**
   * update target change request
   * @returns {ChangeRequest}
   */
  async update({ auth, request, params }) {
    const user = await auth.getUser();
    //verify user's role, return 404 if failed
    VerificationHelper.verifyRole(user, ['Admin', 'Developer']);
    //get request data
    const data = request.only(['title', 'details', 'status']);
    //use service to update change request
    const result = await this.crService.updateRequest(params.id, data, user);
    //verify if resource exist, return 404 if failed
    VerificationHelper.verifyExistance(result);
    return result;
  }

  /**
   * search change request, used for select2 server process
   * @returns {ChangeRequest[]}
   */
  async search({ auth, request, params }) {
    const user = await auth.getUser();
    const target = params.target;
    //if search target is all change requests, verify if user is a admin or developer
    if (target === 'all') {
      VerificationHelper.verifyRole(user, ['Admin', 'Developer']);
    } else {
      VerificationHelper.verifyExistance(user, ' user');
    }
    //get request data
    const data = request.all();
    // use service to get change request list
    const list = await this.crService.searchRequest(data, target);
    return list;
  }

  /**
   * Get all messages belongs to target change request
   * @returns {ChangeRequestMessage[]}
   */
  async getCRMessage({ auth, params }) {
    const user = await auth.getUser();
    const changeRequest = await this.crService.getChangeRequest(params.id);
    //return 404 if current user is neither the owner of the request nor admin
    VerificationHelper.verifyPermission(
      changeRequest,
      user,
      ['Developer', 'Admin'],
      true
    );
    //use service to get change request message list
    const list = await this.crService.getCRMessage(changeRequest, params.num);
    return list;
  }

  /**
   * Create a change request message
   * @returns {ChangeRequest}
   */
  async createCRMessage({ auth, request, params }) {
    const user = await auth.getUser();
    const changeRequest = await this.crService.getChangeRequest(params.id);
    //return 404 if current user is neither the owner of the request nor admin
    VerificationHelper.verifyPermission(
      changeRequest,
      user,
      ['Developer', 'Admin'],
      true
    );
    //get content from request data
    const { content } = request.only('content');
    // create change request message use service
    const result = await this.crService.createCRMessage(
      user,
      changeRequest,
      content
    );
    //verify if result exist, if failed return 404
    VerificationHelper.verifyExistance(result);
    return 'ok';
  }

  /**
   * Get all histories belongs to target change request
   * @returns {ChangeRequestMessage[]}
   */
  async getCRHistory({ auth, params }) {
    const user = await auth.getUser();
    const changeRequest = await this.crService.getChangeRequest(params.id);
    //return 404 if current user is neither the owner of the request nor admin
    VerificationHelper.verifyPermission(
      changeRequest,
      user,
      ['Developer', 'Admin'],
      true
    );
    //use service to get change request history list
    const list = await this.crService.getCRHistory(changeRequest);
    return list;
  }

  /**
   * get status ratio of change requests for selected week
   * @returns {ChartJS JSON}
   */
  async getChartData({ auth, params, response }) {
    const user = await auth.getUser();
    VerificationHelper.verifyRole(user, ['Developer', 'Admin']);
    try {
      // split range string e.g. 1-4-2019~1-11-2019 into arrays of two
      const dateRange = params.range.split('~');
      // get ratio status
      const result = await this.crService.getChartData(dateRange);
      return result;
    } catch (e) {
      // return 404 if date range request is in wrong format
      return response.status(404).send('Wrong format');
    }
  }

  /**
   * add change request into flag list
   */
  async flagChangeRequest({ auth, params }) {
    const user = await auth.getUser();
    const changeRequest = await this.crService.getDetail(user.id, params.id);
    //verify if the current user is the owner of the request, if failed return 404
    VerificationHelper.verifyPermission(changeRequest, user, false, true);
    const result = await this.flagService.flagChangeRequest(
      changeRequest,
      user
    );
    // verify is result exist, if failed return 404
    VerificationHelper.verifyExistance(result);
    return 'ok';
  }

  /**
   * delete change request from flag list
   */
  async unflagChangeRequest({ auth, params }) {
    const user = await auth.getUser();
    await this.flagService.unflagChangeRequest(params.id, user);
    return 'ok';
  }

  /**
   * Create new change request from incoming email
   */
  async createFromMail({ request, params }) {
    const mailJSON = request.all();
    const client = await this.mailService.getClientFromMail(mailJSON);
    // return denied message if client does not exit
    if (this.mailService.requestMailDenied(client, mailJSON, params.key)) {
      return 'denied';
    }
    //create change request
    const changeRequest = await this.crService.createFromMail(mailJSON, client);
    //send a success message
    this.mailService.requestMailApproved(mailJSON['sender'], changeRequest.id);
    return changeRequest;
  }

  /**
   * return change request list from email request
   */
  async mailbackCRInfo({ request, params }) {
    const { sender, subject } = request.only(['sender', 'subject']);
    //get sender user account
    const user = await this.mailService.getUserFromMail(sender);

    // return denied message if client does not exit or wrong request subject
    if (this.mailService.trackCRDenied(user.email, subject, params.key)) {
      return 'Denied';
    }

    //get change request list
    const crData = await this.crService.emailTrack(user, subject);
    if (crData && crData.rows) {
      // if crData contains more than one change reuqest, return email with change request list
      this.mailService.trackCRList(user.email, crData.rows);
    } else {
      // else if crData contains only one change reuqest, return email with this change request detail
      this.mailService.trackCRID(user.email, crData);
    }
    return 'Ok';
  }
}

module.exports = ChangeRequestController;
