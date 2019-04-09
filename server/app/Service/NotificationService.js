'use strict';

/**
 * @author Wei Zheng
 * @description Service used to provide any notification data related function
 */

const Notification = use('App/Models/Notification');
const MapHelper = use('App/Helper/MapHelper');
const User = use('App/Models/User');

class NotificationService {
  /**
   * receive all admins from database and create a notification for each of them
   * @param {Func} computeList call back function to create array of notify object
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

    //catch a super unique case when one of admin was deleted during notification generation process, which is ~10ms
    try {
      //save data to datatabse
      await Notification.createMany(notifyList);
    } catch (e) {}
  }

  /**
   * notify a new registration code was created
   * @param {RegistrationCode} param0
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
   * notify a new user was created
   * @param {User} param0
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
   * @param {ChangeRequest} param0
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
   * notify admin and user when target role has changed
   * @param {User} target target user
   * @param {User} issuer Current user
   * @param {String} role new role
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
   * @param {User} target target user
   * @param {User} issuer Current user
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
   * notify owner when change request was adjusted
   * @param {User} param0
   * @param {String} type adjust type
   * @param {int} issuerID current user id
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
   * @param {User} user current user
   * @param {Object} data datatable filter json
   */
  async notificationPaginate(user, data) {
    const result = await MapHelper.mapDatatableFrom(
      data,
      // callback function to perform custom query
      (table, page, search) =>
        Notification.queryForDatatable(table, page, search, user.id)
    );
    return result;
  }

  /**
   * return notifications separated into list of new and list of old
   * @return {Notification[], Notification[], int}
   * @param {User} user current user
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
   * update notification from unread to read
   * @param {User} user current user
   * @param {Notification || String} target
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
