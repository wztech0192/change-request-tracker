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
   * search user
   */
  async searchUser(request, { role }) {
    const { term, page } = request.all();
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
   * @return {total number of user}
   */
  enterUser(user) {
    user.updated_at = new Date();
    user.save();
    //total user
    return User.getCount();
  }

  /**
   * Get User by email
   * @return {user}
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

  /*
   * Userlist datatable server side processing
   */
  getDatatableJSON(request) {
    return MapHelper.mapDatatableFrom(
      request,
      // callback function to perform custom query

      User.queryForDatatable
    );
  }

  /**
   * Remove User
   * @return {user}
   */
  async deleteUser(targetUser, issuer) {
    await targetUser.delete();
    this.notificationService.userDelete(targetUser, issuer);
    return targetUser;
  }

  /**
   * Update user's information
   * @return {user}
   */
  async updateRole(targetUser, issuer, request) {
    const { role } = request.only('role');
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
