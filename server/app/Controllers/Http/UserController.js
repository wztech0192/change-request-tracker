'use strict';

/**
 * @author Wei Zheng
 * @description register, login, search user, retrieve user list, and retrieve user menu
 */

const User = use('App/Models/User');
const VerificationHelper = use('App/Helper/VerificationHelper');
const MessageService = use('App/Service/MessageService');
const NotificationService = use('App/Service/NotificationService');
const FlagService = use('App/Service/FlagService');
const MapHelper = use('App/Helper/MapHelper');

class UserController {
  constructor() {
    this.messageService = new MessageService();
    this.flagService = new FlagService();
  }

  /**
   * Take email and password then attempt to login
   */
  async login({ request, auth }) {
    const { email, password } = request.all();
    return await auth.attempt(email, password);
  }

  /**
   * search user
   */
  async search({ auth, request, params }) {
    const user = await auth.getUser();
    VerificationHelper.verifyExistance(user, ' user');

    const data = request.all();
    const searchData = data.term || '';

    const userList = await User.query()

      .where(function() {
        this.where('email', 'like', `%${searchData}%`)
          .orWhere('role', 'like', `%${searchData}%`)
          .orWhere(function() {
            const splitSearch = searchData.split(' ');
            for (let split of splitSearch) {
              // split the string and search each splitted item
              this.where('full_name', 'like', `%${split || 'N/A'}%`);
            }
          });
      })
      .andWhere('role', 'like', params.role === 'all' ? '%%' : params.role)

      .paginate(data.page, 10);

    return {
      results: userList.rows,
      pagination: {
        more: userList.pages.page < userList.pages.lastPage
      },
      totals: userList.rows.length
    };
  }

  /**
   * Get Self Information
   * @return {user}
   */
  async self({ auth }) {
    const user = await auth.getUser();
    user.updated_at = new Date();
    await user.save();

    //total user
    user.total = await User.getCount();
    return user;
  }

  /**
   * Get User by email
   * @return {user}
   */
  async get({ auth, params }) {
    const user = await auth.getUser();
    VerificationHelper.verifyExistance(user);
    const targetUser = await User.findBy('email', params.email);
    VerificationHelper.verifyExistance(targetUser);
    return targetUser;
  }

  /**
   * Get RoleList
   * @return {user}
   */
  async getRoleList({ auth, params }) {
    const user = await auth.getUser();
    VerificationHelper.verifyRole(user, ['Developer', 'Admin']);
    const userQuery = await User.query()
      .where('role', params.role)
      .fetch();
    return userQuery.rows;
  }

  /*
   * Userlist datatable server side processing
   */
  async datatable({ auth, request }) {
    const user = await auth.getUser();
    VerificationHelper.verifyRole(user, ['Developer', 'Admin']);

    return await MapHelper.mapDatatableFrom(
      request,
      // callback function to perform custom query
      (table, page, search) =>
        User.query()
          .where('id', search)
          .orWhere(function() {
            const splitSearch = search.split(' ');
            for (let split of splitSearch) {
              // split the string and search each splitted item
              this.where('full_name', 'like', `%${split || 'N/A'}%`);
            }
          })
          .orWhere('email', 'like', `%${search}%`)
          .orWhere('role', 'like', `%${search}%`)
          .orWhere('created_at', 'like', `%${search}%`)
          .orderBy(
            table.columns[table.order[0].column].data,
            table.order[0].dir
          )
          .paginate(page, table.length)
    );
  }
  /**
   * Get All User
   * @return {user[]}
   */
  async getAll({ auth }) {
    const user = await auth.getUser();
    VerificationHelper.verifyRole(user, ['Developer', 'Admin']);
    const userQuery = await User.query().fetch();
    return userQuery.rows;
  }

  /**
   * Remove User
   * @return {user}
   */
  async destroy({ auth, params }) {
    const user = await auth.getUser();
    const targetUser = await User.find(params.id);
    //permission verify
    VerificationHelper.verifyPermissionForDeleteUser(targetUser, user, [
      'Developer',
      'Admin'
    ]);
    await NotificationService.userDelete(targetUser, user);
    await targetUser.delete();
    return targetUser;
  }

  /**
   * Update user's information
   * @return {user}
   */
  async update({ auth, request, params }) {
    const user = await auth.getUser();
    const targetUser = await User.find(params.id);
    let { role } = request.only('role');

    //verify handler's role
    VerificationHelper.verifyPermissionForUser(
      targetUser,
      user,
      ['Developer', 'Admin'],
      false
    );

    //notify role change
    NotificationService.roleChange(targetUser, user, role);

    //change role and save
    targetUser.role = role;
    if (targetUser.role == 'Developer') {
      targetUser.isDev = 1;
    }
    await targetUser.save();

    return targetUser;
  }

  /**
   * return flagged list
   * @return {array}
   */
  async getFlaggedList({ auth }) {
    const user = await auth.getUser();

    return await this.flagService.getFlaggedList(user);
  }

  /**
   * get unread message
   * @return {array}
   */
  async getMenuMsgList({ auth }) {
    const user = await auth.getUser();
    return await this.messageService.getMenuMsgList(user);
  }

  /**
   * return notification list
   * @return {Object}
   */
  async getNotificationList({ auth }) {
    const user = await auth.getUser();
    return await NotificationService.getNotification(user);
  }

  /**
   * return notification list
   * @return {Object}
   */
  async updateNotification({ auth, params }) {
    const user = await auth.getUser();
    await NotificationService.updateNotification(user, params.target);
    return 'OK';
  }

  /**
   * return datatable json for notification list
   * @return {Datatable JSON}
   */
  async notificationPaginate({ auth, request }) {
    const user = await auth.getUser();
    return await NotificationService.notificationPaginate(user, request);
  }
}

module.exports = UserController;
