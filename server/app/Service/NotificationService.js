'use strict';

/**
 * @author Wei Zheng
 * @description notification method used across multiple controllers
 */

const Notification = use('App/Models/Notification');
const MapHelper = use('App/Helper/MapHelper');
const User = use('App/Models/User');

class NotificationService {
  /**
   * notify every admin
   */
  async _notifyAdmin(computeList) {
    //get all admins
    const adminList = await User.queryForAdminID();

    // fill change request data
    const notifyList = computeList(adminList.rows.length);

    //notify every admin
    for (let i = 0; i < adminList.rows.length; i++) {
      notifyList[i].user_id = adminList.rows[i].id;
    }

    //save data to datatabse
    Notification.createMany(notifyList);
  }

  /**
   * notify a new change request was created
   */
  newRegisterCode({ role, creator_name }) {
    //notify all admin
    this._notifyAdmin(length => {
      // call back function to fill array with resource data
      return new Array(length).fill().map(a => ({
        user_id: null,
        content: `New ${role.toLowerCase()} registeration code was created by ${creator_name}`,
        icon: 'fa-user-plus'
      }));
    });
  }

  /**
   * notify a new change request was created
   */
  newUser({ id, full_name, role, email }) {
    //notify all admin
    this._notifyAdmin(length => {
      if (role !== 'Admin' && role !== 'Developer') {
        // notify client himself if he is a client
        length++;
      }
      // call back function to fill array with resource data
      return new Array(length).fill().map(a => ({
        user_id: id,
        content: `${full_name} has joined as a ${role.toLowerCase()}`,
        icon: 'fa-sign-in',
        link: `@${email}`
      }));
    });
  }

  /**
   * notify a new change request was created
   */
  newChangeRequest({ user_id, id, clientName }) {
    //notify all admin
    this._notifyAdmin(length => {
      // call back function to fill array with resource data
      const notifyList = new Array(length + 1).fill().map(a => ({
        user_id: user_id,
        change_request_id: id,
        content: `CR ID: ${id} was created by ${clientName}`,
        icon: 'fa-upload text-blue',
        link: `/change-request/${id}/content`
      }));
      return notifyList;
    });
  }

  /**
   * notify admin and user when his role got changed
  
   */
  roleChange(target, issuer, role) {
    var oldRole = target.role;
    //notify all admin
    this._notifyAdmin(length => {
      // call back function to fill array with resource data
      const notifyList = new Array(length + 1).fill().map(a => ({
        user_id: target.user_id,
        content: `${target.full_name}'s role has been changed 
                  from ${oldRole} to ${role}. The action is performed
                  by ${issuer.full_name}`,
        icon: 'fa-user',
        link: `@${target.email}`
      }));
      return notifyList;
    });
  }

  /**
   * notify admin when a user was deleted
   */
  userDelete(target, issuer) {
    //notify all admin
    this._notifyAdmin(length => {
      // call back function to fill array with resource data
      const notifyList = new Array(length).fill().map(a => ({
        user_id: null,
        content: `${target.full_name} was deleted by ${issuer.full_name}`,
        icon: 'fa-user-times'
      }));
      return notifyList;
    });
  }

  /**
   * notify owner when change request got adjusted
   */
  updateChangeRequest({ user_id, id }, type, issuerID) {
    let icon = '';
    let detail = 'content was modified';
    let link = 'history';
    // notify detail by update type
    switch (type) {
      case 'New Status: TO DO':
        icon = 'text-yellow fa-spinner';
        detail = 'status was set to TO DO';
        break;
      case 'New Status: IN PROGRESS':
        icon = 'text-blue fa-refresh';
        detail = 'status was set to IN PROGRESS';
        break;
      case 'New Status: COMPLETE':
        icon = 'text-green fa-check';
        detail = 'was COMPLETED';
        break;
      case 'New Status: CANCELLED':
        icon = 'text-red fa-ban';
        detail = 'was CANCELLED';
        break;
      default:
        // content edit
        icon = 'fa-edit';
        link = 'content';
        break;
    }

    const data = {
      user_id: user_id,
      change_request_id: id,
      content: `CR ID: ${id} ${detail}`,
      icon: icon,
      link: `/change-request/${id}/${link}`
    };

    //create notification for the client
    Notification.create(data);

    //create notification for issuer
    data.user_id = issuerID;
    Notification.create(data);
  }

  /**
   * return datatable json for notification list
   * @return {Datatable JSON}
   */
  async notificationPaginate(user, request) {
    const result = await MapHelper.mapDatatableFrom(
      request,
      // callback function to perform custom query
      (table, page, search) =>
        Notification.queryForDatatable(table, page, search, user.id)
    );
    return result;
  }

  /**
   * @return {notification list object}
   */
  async getNotification(user) {
    const notifyList_old = await Notification.queryForLastTen(user);
    const notifyList_new = await Notification.queryForNew(user);
    //get total change request
    const totalNotifications = await user.notifications().getCount();

    return {
      new: notifyList_new.rows,
      old: notifyList_old.rows,
      totalNotifications
    };
  }

  /**
   * @return {notification list object}
   */
  async updateNotification(user, target) {
    if (target === 'all') {
      // set isNew to false for every new notification.
      await Notification.queryToClearAllNew(user);
    } else {
      //set isNew to false for single notification
      await Notification.queryToClearNew(user, target);
    }
  }
}

module.exports = NotificationService;
