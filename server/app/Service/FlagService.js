'use strict';

/**
 * @author Wei Zheng
 * @description dev tools
 */

const FlagItem = use('App/Models/FlagItem');
const DevTodo = use('App/Models/Dev/DevTodo');
const ChangeRequest = use('App/Models/ChangeRequest/ChangeRequest');

class FlagService {
  /**
   * check if the change request is flagged by the user
   */
  async isFlag(changeRequest, user_id) {
    const checkFlag = await FlagItem.queryForFlag(user_id, changeRequest.id);
    if (checkFlag > 0) {
      return true;
    }
    return false;
  }

  /**
   * add change request into flag list
   */
  async flagChangeRequest(changeRequest, user) {
    // make sure user has not flag this request yet
    const isFlag = await this.isFlag(changeRequest, user.id);
    if (isFlag > 1) {
      return 'Already exist';
    }

    //create flag item
    await FlagItem.create({
      user_id: user.id,
      change_request_id: changeRequest.id,
      content: changeRequest.title,
      status: changeRequest.status
    });
    return 'ok';
  }

  /**
   * delete change request from flag list
   */
  async unflagChangeRequest(id, user) {
    await FlagItem.queryToDelete(user.id, id);
    return 'ok';
  }

  /**
   * get flagged change request
   */
  async getFlaggedCR(user) {
    const result = await FlagItem.queryForCR(user.id);
    return result.rows;
  }

  /**
   * get flagged task
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
   * get flagged list
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
