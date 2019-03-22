'use strict';

/**
 * @author Wei Zheng
 * @description register, login, search user, retrieve user list, and retrieve user menu
 */

const User = use('App/Models/User');
const AuthorizationService = use('App/Service/AuthorizationService');
const RegistrationCodeService = use('App/Service/RegistrationCodeService');
const MessageService = use('App/Service/MessageService');
const NotificationService = use('App/Service/NotificationService');
const Hash = use('Hash');
const FlagService = use('App/Service/FlagService');
const MyHelper = use('App/Helper/MyHelper');
const Validator = use('Validator');
const Database = use('Database');

class UserController {
  /**
   * Take email and password then attempt to login
   *
   */
  async login({ request, auth }) {
    const { email, password } = request.all();
    const token = await auth.attempt(email, password);
    return token;
  }

  /**
   * Take email and password then create a user inside database. If success call login function
   * @return {login}
   */
  async register({ request }) {
    //verify registration code
    const code = await RegistrationCodeService.getMatchCode(
      request.only('code')
    );

    const userInfo = request.except(['code', 'password_retype']);

    //if not allow to edit, set registration data to code data
    if (code.allowEdit === 0) {
      MyHelper.mapUserInfoFrom(code, userInfo);
    }

    //validate all request data, return message if fails
    const validation = await Validator.validateAll(
      userInfo,
      User.registerRules
    );
    if (validation.fails()) {
      return validation.messages();
    }

    MyHelper.mapUserInfo(userInfo, code);

    //create user
    const user = await User.create(userInfo);

    //create welcome message
    MessageService.sendWelcomeMessage(userInfo);

    //remove used code
    RegistrationCodeService.removeCode(code.id);

    // notify new registerd user
    NotificationService.newUser(user);

    //pass arguments from this method to login
    return this.login(...arguments);
  }

  /**
   * search user
   */
  async search({ auth, request, params }) {
    const user = await auth.getUser();
    AuthorizationService.verifyExistance(user, ' user');

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
    AuthorizationService.verifyExistance(user);
    const targetUser = await User.findBy('email', params.email);
    AuthorizationService.verifyExistance(targetUser);
    return targetUser;
  }

  /**
   * Get RoleList
   * @return {user}
   */
  async getRoleList({ auth, params }) {
    const user = await auth.getUser();
    AuthorizationService.verifyRole(user, ['Developer', 'Admin']);
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
    AuthorizationService.verifyRole(user, ['Developer', 'Admin']);

    return await MyHelper.mapDatatableFrom(
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
    AuthorizationService.verifyRole(user, ['Developer', 'Admin']);
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
    AuthorizationService.verifyPermissionForDeleteUser(targetUser, user, [
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
    AuthorizationService.verifyPermissionForUser(
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

    return await FlagService.getFlaggedList(user);
  }

  /**
   * get unread message
   * @return {array}
   */
  async getMenuMsgList({ auth }) {
    const user = await auth.getUser();
    return await MessageService.getMenuMsgList(user);
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
