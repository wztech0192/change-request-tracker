'use strict';

/**
 * @author Wei Zheng
 * @description This controller serves as the entry & exit point to all user related data.
 *              The controller uses UserService to provide read and update, as well as
 *              other user related features.
 */

const VerificationHelper = use('App/Helper/VerificationHelper');
const UserService = use('App/Service/UserService');

class UserController {
  /**
   * declare services that used in this controller
   */
  constructor() {
    this.userService = new UserService();
  }

  /**
   * attempt to login with user email and password
   * @return {Token Object}
   */
  async login({ request, auth }) {
    const { email, password } = request.all();
    const token = await auth.attempt(email, password);

    return token;
  }

  /**
   * search user, used for select2 server process
   * @return {User[]}
   */
  async search({ auth, request, params }) {
    const user = await auth.getUser();
    VerificationHelper.verifyExistance(user, ' user');
    const data = request.all();
    const result = await this.userService.searchUser(data, params);

    return result;
  }

  /**
   * Get current user information
   * @return {User}
   */
  async self({ auth }) {
    const user = await auth.getUser();
    user.total = await this.userService.enterUser(user);

    return user;
  }

  /**
   * Get User by email
   * @return {User}
   */
  async get({ auth, params }) {
    const user = await auth.getUser();
    VerificationHelper.verifyExistance(user);
    const targetUser = await this.userService.getUserByEmail(params.email);
    VerificationHelper.verifyExistance(targetUser);

    return targetUser;
  }

  /**
   * return json for datatable server side processing
   * @return {Object} datatable result json
   */
  async datatable({ auth, request }) {
    //console.log(request.all());
    const user = await auth.getUser();
    VerificationHelper.verifyRole(user, ['Developer', 'Admin']);
    const data = request.all();
    const tableJSON = await this.userService.getDatatableJSON(data);

    return tableJSON;
  }

  /**
   * Remove User from database
   * @return {User}
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
   * Update target user's role
   * @return {User}
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
    const { role } = request.only('role');
    await this.userService.updateRole(targetUser, user, role);

    return targetUser;
  }
}

module.exports = UserController;
