'use strict';

/**
 * @author Wei Zheng
 * @description Service used to flag or unflag change request and DevTask
 */

const FlagItem = use('App/Models/FlagItem');
const DevTodo = use('App/Models/Dev/DevTodo');
const ChangeRequest = use('App/Models/ChangeRequest/ChangeRequest');

class FlagService {
  /**
   * verify if the change request is flagged by the user
   * @return {Boolean}
   * @param {ChangeRequest} changeRequest target request
   * @param {int} user_id current user id
   */
  async isFlag(changeRequest, user_id) {
    const checkFlag = await FlagItem.queryForFlag(user_id, changeRequest.id);
    if (checkFlag > 0) {
      return true;
    }

    return false;
  }

  /**
   * add change request into flag table
   * @param {ChangeRequest} changeRequest target request
   * @param {User} user current user
   */
  flagChangeRequest(changeRequest, user) {
    // make sure user has not flag this request yet
    if (changeRequest.isFlag > 1) {
      return 'Already exist';
    }

    //create flag item
    return FlagItem.create({
      user_id: user.id,
      change_request_id: changeRequest.id,
      content: changeRequest.title,
      status: changeRequest.status
    });
  }

  /**
   * delete change request from flag table
   * @return {FlagItem[]}
   * @param {int} id FlagItem id
   * @param {User} user current user
   */
  unflagChangeRequest(id, user) {
    return FlagItem.queryToDelete(user.id, id);
  }

  /**
   * get flagged change request
   * @return {ChangeRequest[]}
   * @param {User} user current user
   */
  async getFlaggedCR(user) {
    const result = await FlagItem.queryForCR(user.id);

    return result.rows;
  }

  /**
   * get flagged task
   * @return {DevTodo[]}
   * @param {User} user current user
   */
  async getFlaggedTask(user) {
    let result = [];
    if (user.role === 'Developer') {
      result = await DevTodo.queryForFlag();
      return result.rows;
    }

    return result;
  }

  /**
   * return list of flagged change request and devtask, and total number of change request
   * @returns {ChangeRequest[], DevTask[], int, int}
   */
  async getFlaggedList(user) {
    //get task
    const flagTask = await this.getFlaggedTask(user);
    //get change request
    const flagCR = await this.getFlaggedCR(user);

    //get total change request if user is admin or devloper, else get total submited
    const totalCR =
      user.role === 'Admin' || user.role === 'Developer'
        ? await ChangeRequest.getCount()
        : await user.change_requests().getCount();

    return {
      flagTask: flagTask,
      flagCR: flagCR,
      length: flagTask.length + flagCR.length,
      totalCR
    };
  }
}

module.exports = FlagService;
