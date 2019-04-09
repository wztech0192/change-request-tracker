'use strict';

/**
 * @author Wei Zheng
 * @description dev service
 */

const User = use('App/Models/User');
const MapHelper = use('App/Helper/MapHelper');
const NotificationService = use('App/Service/NotificationService');
class UserService {
  constructor() {
    this.notificationService = new NotificationService();
  }

  /**
   * search user, used for select2 server process
   * @return {User[]}
   * @param {Object} param0
   * @param {Object} param1
   */
  async searchUser({ term, page }, { role }) {
    const searchData = term || '';
    const userList = await User.queryForSearch(searchData, page, role);
    return {
      results: userList.rows,
      pagination: {
        more: userList.pages.page < userList.pages.lastPage
      },
      totals: userList.rows.length
    };
  }

  /**
   * update user's last visit time and return the total number of user
   * @return {int} total number of users
   * @param {User} user current user
   */
  enterUser(user) {
    user.updated_at = new Date();
    user.save();
    //total user
    return User.getCount();
  }

  /**
   * Get User by email
   * @return {User}
   * @param {String} email
   */
  getUserByEmail(email) {
    return User.findBy('email', email);
  }

  /**
   * Get User by email
   * @return {user}
   */
  getUserByID(id) {
    return User.find(id);
  }

  /**
   * return json for datatable server side processing
   * @return {Object} datatable result json
   * @param {Object} data datatable filter json
   */
  getDatatableJSON(data) {
    return MapHelper.mapDatatableFrom(
      data,
      // callback function to perform custom query

      User.queryForDatatable
    );
  }

  /**
   * Remove User from database
   * @return {user}
   * @param {User} targetUser target user
   * @param {User} issuer current user
   */
  async deleteUser(targetUser, issuer) {
    await this.notificationService.userDelete(targetUser, issuer);
    await targetUser.delete();
    return targetUser;
  }

  /**
   * Update user's information
   * @return {User}
   * @param {User} targetUser target user
   * @param {User} issuer current user
   * @param {String} role new role
   */
  async updateRole(targetUser, issuer, role) {
    //notify role change
    this.notificationService.roleChange(targetUser, issuer, role);

    //change role and save
    targetUser.role = role;
    //if change to developer, set isDev to true
    if (targetUser.role == 'Developer') {
      targetUser.isDev = true;
    }
    await targetUser.save();
    return targetUser;
  }
}

module.exports = UserService;
