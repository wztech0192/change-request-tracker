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
   * notify every admin when new change request was created
   * @returns {notification}
   */
  async newChangeRequest(changeRequest) {
    //get all admins
    const adminList = await Database.table('users')
      .select('id')
      .where('role', 'Admin')
      .orWhere('role', 'Developer');

    // fill change request data
    const notifyList = new Array(adminList.length + 1).fill().map(a => ({
      user_id: null,
      change_request_id: changeRequest.id,
      content: `CR #${changeRequest.id} was created by ${
        changeRequest.clientName
      }`,
      icon: 'fa-upload text-blue',
      link: `/change-request/${changeRequest.id}`
    }));

    //reserve the first notification to change request owner
    notifyList[0].user_id = changeRequest.user_id;

    //  console.log(notifyList[0]);
    //notify every admin
    for (let i = 0; i < adminList.length; i++) {
      // console.log(i + 1);
      notifyList[i + 1].user_id = adminList[i].id;
      // console.log(notifyList);
    }

    Notification.createMany(notifyList);
  }

  /**
   * @return {notification list object}
   */
  async getNotification(user) {
    const notifyList_old = await user
      .notifications()
      .where('isNew', '0')
      .orderBy('created_at', 'desc')
      .fetch();
    const notifyList_new = await user
      .notifications()
      .where('isNew', '1')
      .orderBy('created_at', 'desc')
      .fetch();
    /*  if (notifyList_new.rows.length > 0) {
      // set isNew to false for new notification.
      await Database.table('notifications')
        .where('user_id', user.id)
        .where('isNew', true)
        .update('isNew', false);
    }*/
    return {
      new: notifyList_new,
      old: notifyList_old
    };
  }

  /**
   * @return {notification list object}
   */
  async updateNotification(user, target) {
    if (target === 'all') {
      // set isNew to false for every new notification.
      await Database.table('notifications')
        .where('user_id', user.id)
        .where('isNew', true)
        .update('isNew', false);
    } else {
      //set isNew to false for single notification
      await Database.table('notifications')
        .where('user_id', user.id)
        .where('id', target)
        .update('isNew', false);
    }
  }
}

module.exports = new NotificationService();
