'use strict';

/**
 * @author Wei Zheng
 * @description create, read, update, and delete for change requests
 */

const VerificationHelper = use('App/Helper/VerificationHelper');
const FlagService = use('App/Service/FlagService');
const MailService = use('App/Service/MailService');
const ChangeRequestService = use('App/Service/ChangeRequestService');

class ChangeRequestController {
  constructor() {
    this.flagService = new FlagService();
    this.mailService = new MailService();
    this.crService = new ChangeRequestService(this.flagService);
  }

  /**
   * display change request detail
   * @returns {ChangeRequest}
   */
  async detail({ auth, params }) {
    const user = await auth.getUser();
    const changeRequest = await this.crService.getDetail(user, params.id);
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
   * Get all change request belongs to this user
   * @returns {ChangeRequest[]}
   */
  async index({ auth, request }) {
    const user = await auth.getUser();
    return await this.crService.index(user, request);
  }

  /**
   * Get change request list by filter
   * @returns {ChangeRequest[]}
   */
  async getRequestList({ auth, request }) {
    const user = await auth.getUser();
    VerificationHelper.verifyRole(user, ['Developer', 'Admin']);
    return await this.crService.getRequestList(request);
  }

  /**
   * Create a change request
   * @returns {ChangeRequest}
   */
  async create({ auth, request }) {
    const data = request.only(['title', 'details']);
    //throw error if title or details is empty
    VerificationHelper.verifyRequest(data);

    let { message, client } = request.only(['message', 'client']);
    const user = await auth.getUser();

    client = await this.crService.getClientFrom(user, client);

    VerificationHelper.verifyExistance(client);
    return await this.crService.create(data, client, user, message);
  }

  /**
   * delete target change request
   * @returns {ChangeRequest}
   */
  async update({ auth, request, params }) {
    const user = await auth.getUser();
    //verify user role, return 404 if failed
    VerificationHelper.verifyRole(user, ['Admin', 'Developer']);
    const result = await this.crService.update(params.id, request, user);
    //verify if resource exist, return 404 if failed
    VerificationHelper.verifyExistance(result);
    return result;
  }

  /**
   * search change request
   */
  async search({ auth, request, params }) {
    const user = await auth.getUser();
    const target = params.target;
    //if search every change request, verify if user is a admin or developer
    if (target === 'all') {
      VerificationHelper.verifyRole(user, ['Admin', 'Developer']);
    } else {
      VerificationHelper.verifyExistance(user, ' user');
    }
    return await this.crService.search(request, target);
  }

  /**
   * Get all messages belongs to this change request
   * @returns {ChangeRequestMessage[]}
   */
  async getCRMessage({ auth, params }) {
    const user = await auth.getUser();
    const changeRequest = await this.crService.getChangeRequest(params.id);
    //return 404 if current user is not the owner or admin
    VerificationHelper.verifyPermission(
      changeRequest,
      user,
      ['Developer', 'Admin'],
      true
    );

    return this.crService.getCRMessage(changeRequest, params.num);
  }

  /**
   * Create a change request message
   * @returns {ChangeRequest}
   */
  async createCRMessage({ auth, request, params }) {
    const user = await auth.getUser();
    const changeRequest = await this.crService.getChangeRequest(params.id);
    VerificationHelper.verifyPermission(
      changeRequest,
      user,
      ['Developer', 'Admin'],
      true
    );
    const { content } = request.only('content');
    return await this.crService.createCRMessage(user, changeRequest, content);
  }

  /**
   * Get all histories belongs to this change request
   * @returns {ChangeRequestMessage[]}
   */
  async getCRHistory({ auth, params }) {
    const user = await auth.getUser();
    const changeRequest = await this.crService.getChangeRequest(params.id);
    VerificationHelper.verifyPermission(
      changeRequest,
      user,
      ['Developer', 'Admin'],
      true
    );
    return await this.crService.getCRHistory(changeRequest);
  }

  /**
   * delete target change request message
   * @returns {ChartJS JSON}
   */
  async getChartData({ auth, params }) {
    const user = await auth.getUser();
    VerificationHelper.verifyRole(user, ['Developer', 'Admin']);
    return await this.crService.getChartData(params);
  }

  /**
   * add change request into flag list
   */
  async flagChangeRequest({ auth, request }) {
    const user = await auth.getUser();
    const changeRequest = request.all();
    VerificationHelper.verifyPermission(changeRequest, user, false, true);
    return await this.flagService.flagChangeRequest(changeRequest, user);
  }

  /**
   * delete change request from flag list
   */
  async unflagChangeRequest({ auth, params }) {
    const user = await auth.getUser();
    return await this.flagService.unflagChangeRequest(params.id, user);
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
   * handle email change request information request
   */
  async mailbackCRInfo({ request, params }) {
    const { sender, subject } = request.only(['sender', 'subject']);
    //get sender user account
    const user = await this.mailService.getUserFromMail(sender);

    // return denied message if client does not exit or wrong request subject
    if (this.mailService.trackCRDenied(user.email, subject, params.key)) {
      return 'Denied';
    }
    const crData = await this.crService.emailTrack(user, subject);
    if (crData && crData.rows) {
      this.mailService.trackCRList(user.email, crData.rows);
    } else {
      this.mailService.trackCRID(user.email, crData);
    }

    return 'Ok';
  }
}

module.exports = ChangeRequestController;
