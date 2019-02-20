'use strict';

/**
 * @author Wei Zheng
 * @description notification method used across multiple controllers
 */

const Notification = use('App/Models/Notification');
const CrudService = use('App/Service/CrudService');
const Database = use('Database');

class NotificationService {
  /**
   * Create new notification
   * @returns {notification}
   */
  async createNotification(msgData) {
    var notification = new Notification();
    notification.fill(msgData);
    await notification.save();
    return notification;
  }

  /**
   * delete notification
   * @returns {notification}
   */
  async deleteNotification(auth, params) {
    return CrudService.destroy(auth, params, Notification, {
      verify: (user, notification) =>
        AuthorizationService.verifyNotificationOwnership(notification, user)
    });
  }
}

module.exports = new NotificationService();
