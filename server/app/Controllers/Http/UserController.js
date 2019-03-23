'use strict';

/**
 * @author Wei Zheng
 * @description register, login, search user, retrieve user list, and retrieve user menu
 */

const VerificationHelper = use('App/Helper/VerificationHelper');
const UserService = use('App/Service/UserService');

class UserController {
  constructor() {
    this.userService = new UserService();
  }

  /**
   * Take email and password then attempt to login
   */
  async login({ request, auth }) {
    const { email, password } = request.all();
    const token = await auth.attempt(email, password);
    return token;
  }

  /**
   * search user
   */
  async search({ auth, request, params }) {
    const user = await auth.getUser();
    VerificationHelper.verifyExistance(user, ' user');
    const result = await this.userService.searchUser(request, params);
    return result;
  }

  /**
   * Get Self Information
   * @return {user}
   */
  async self({ auth }) {
    const user = await auth.getUser();
    user.total = await this.userService.enterUser(user);
    return user;
  }

  /**
   * Get User by email
   * @return {user}
   */
  async get({ auth, params }) {
    const user = await auth.getUser();
    VerificationHelper.verifyExistance(user);
    const targetUser = await this.userService.getUserByEmail(params.email);
    VerificationHelper.verifyExistance(targetUser);
    return targetUser;
  }

  /*
   * Userlist datatable server side processing
   */
  async datatable({ auth, request }) {
    const user = await auth.getUser();
    VerificationHelper.verifyRole(user, ['Developer', 'Admin']);
    const tableJSON = await this.userService.getDatatableJSON(request);
    return tableJSON;
  }

  /**
   * Remove User
   * @return {user}
   */
  async destroy({ auth, params }) {
    const user = await auth.getUser();
    const targetUser = await this.userService.getUserByID(params.id);
    //permission verify
    VerificationHelper.verifyPermissionForDeleteUser(targetUser, user, [
      'Developer',
      'Admin'
    ]);
    await this.userService.deleteUser(targetUser, user);
    return targetUser;
  }

  /**
   * Update user's information
   * @return {user}
   */
  async update({ auth, request, params }) {
    const user = await auth.getUser();
    const targetUser = await this.userService.getUserByID(params.id);
    //verify handler's role
    VerificationHelper.verifyPermissionForUser(
      targetUser,
      user,
      ['Developer', 'Admin'],
      false
    );
    await this.userService.updateRole(targetUser, user, request);
    return targetUser;
  }
}

module.exports = UserController;
