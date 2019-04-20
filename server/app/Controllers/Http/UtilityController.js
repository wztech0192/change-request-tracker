'use strict';

/**
 * @author Wei Zheng
 * @description This controller serves as the entry & exit point to all utility features, for example, download files.
 *              The controller uses MessageService, FlagService, and NotificationService
 */

const MessageService = use('App/Service/MessageService');
const NotificationService = use('App/Service/NotificationService');
const FlagService = use('App/Service/FlagService');
const Helpers = use('Helpers');

class UtilityController {
  /**
   * Delcare services used in this controller
   */
  constructor() {
    this.messageService = new MessageService();
    this.flagService = new FlagService();
    this.notificationService = new NotificationService();
  }

  /**
   * Download CRViewer
   * @return {File}
   */
  async getCRViewer({ response }) {
    return response.download(Helpers.publicPath('/CRViewer.zip'));
  }

  /**
   * Download User Manual
   * @return {File}
   */
  async getUserManual({ response }) {
    return response.download(Helpers.publicPath('/CRT_UserManual.pdf'));
  }

  /**
   * return list of flagged change request and devtask, and total number of change requests
   * @returns {ChangeRequest[], DevTask[], int, int}
   */
  async getFlaggedList({ auth }) {
    const user = await auth.getUser();
    const list = await this.flagService.getFlaggedList(user);

    return list;
  }

  /**
   * return message separated into list of new and list of archived
   * @return {Message[], Message[], int}
   */
  async getMenuMsgList({ auth }) {
    const user = await auth.getUser();
    const list = await this.messageService.getMenuMsgList(user);

    return list;
  }

  /**
   * return notifications separated into list of new and list of old
   * @return {Notification[], Notification[], int}
   */
  async getNotificationList({ auth }) {
    const user = await auth.getUser();
    const list = await this.notificationService.getNotification(user);

    return list;
  }

  /**
   * update notification from unread to read
   * @return {String}
   */
  async updateNotification({ auth, params }) {
    const user = await auth.getUser();
    await this.notificationService.updateNotification(user, params.target);

    return 'OK';
  }

  /**
   * return datatable json for notification list
   * @return {Datatable JSON}
   */
  async notificationPaginate({ auth, request }) {
    //console.log(request.all());
    const user = await auth.getUser();
    const data = request.all();
    const result = await this.notificationService.notificationPaginate(
      user,
      data
    );

    return result;
  }
}

module.exports = UtilityController;
