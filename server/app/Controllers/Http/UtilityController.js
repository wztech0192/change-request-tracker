'use strict';

/**
 * @author Wei Zheng
 * @description register, login, search user, retrieve user list, and retrieve user menu
 */

const MessageService = use('App/Service/MessageService');
const NotificationService = use('App/Service/NotificationService');
const FlagService = use('App/Service/FlagService');

class UtilityController {
  constructor() {
    this.messageService = new MessageService();
    this.flagService = new FlagService();
    this.notificationService = new NotificationService();
  }

  /**
   * return flagged list
   * @return {array}
   */
  async getFlaggedList({ auth }) {
    const user = await auth.getUser();
    const list = await this.flagService.getFlaggedList(user);
    return list;
  }

  /**
   * get unread message
   * @return {array}
   */
  async getMenuMsgList({ auth }) {
    const user = await auth.getUser();
    const list = await this.messageService.getMenuMsgList(user);
    return list;
  }

  /**
   * return notification list
   * @return {Object}
   */
  async getNotificationList({ auth }) {
    const user = await auth.getUser();
    const list = await this.notificationService.getNotification(user);
    return list;
  }

  /**
   * return notification list
   * @return {Object}
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
    const result = await this.notificationService.notificationPaginate(
      user,
      request
    );
    return result;
  }
}

module.exports = UtilityController;
