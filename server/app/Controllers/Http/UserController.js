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

    MyHelper.mapUserInfo(userInfo, code.role);

    //create user
    const user = await User.create(userInfo);

    //create welcome message
    MessageService.sendWelcomeMessage(code, userInfo);

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
    AuthorizationService.verifyRole(user);

    const data = request.all();
    const userList = await User.query()
      .where(function() {
        this.where('full_name', 'like', `%${data.term || ''}%`).orWhere(
          'email',
          'like',
          `%${data.term || ''}%`
        );
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
    return user;
  }

  /**
   * Get User
   * @return {user}
   */
  async get({ auth, params }) {
    const user = await auth.getUser();
    const targetUser = await User.find(params.id);
    AuthorizationService.verifyPermissionForUser(targetUser, user, null, true);
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
          .where('id', 'like', search)
          .orWhere('full_name', 'like', search)
          .orWhere('email', 'like', search)
          .orWhere('role', 'like', search)
          .orWhere('created_at', 'like', search)
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

    //change role and save
    targetUser.role = role;
    if (targetUser.role == 'Developer') {
      targetUser.isDev = 1;
    }
    await targetUser.save();
    return targetUser;

    /* //if request a role change, verify current user's role then update target user
    if (data.role) {
      //role check
      AuthorizationService.verifyPermissionForUser(
        targetUser,
        user,
        ['Developer', 'Admin'],
        false
      );
      targetUser.role = data.role;
      if (targetUser.role == 'Developer') {
        targetUser.isDev = 1;
      }
    }
    //else allow user to update themselve for some profile
    else {
      //allow self update
      AuthorizationService.verifyPermissionForUser(
        targetUser,
        user,
        null,
        true
      );
      data = request.except(['full_name', 'email', 'password']);

      if (data.passworld || data.email) {
        //validate password or email
        const validation = await Validator.validateAll(data, User.changeRules);
        if (validation.fails()) return validation.messages();

        //if has password request, hash the password
        if (data.password) {
          data.password = await Hash.make(data.password);
        }
      }

      targetUser.merge(data);
    }*/
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
  async getUnreadMsgList({ auth }) {
    const user = await auth.getUser();
    return await MessageService.getUnreadMsgList(user);
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
