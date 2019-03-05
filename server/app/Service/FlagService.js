'use strict';

/**
 * @author Wei Zheng
 * @description dev tools
 */

const FlagItem = use('App/Models/FlagItem');
const Database = use('Database');

class FlagService {
  /**
   *
   */
  static async isFlag(changeRequest, user_id) {
    // make sure user has not flag this request yet
    const checkFlag = await FlagItem.query()
      .where('user_id', user_id)
      .andWhere('change_request_id', changeRequest.id)
      .getCount();

    if (checkFlag > 0) {
      return true;
    }
    return false;
  }

  /**
   * add change request into flag list
   */
  static async flagChangeRequest(changeRequest, user) {
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
  static async unflagChangeRequest(id, user) {
    await FlagItem.query()
      .where('change_request_id', id)
      .andWhere('user_id', user.id)
      .delete();
    return 'ok';
  }

  /**
   * get flagged change request
   */
  static async getFlaggedCR(user) {
    return await Database.table('flag_items')
      .select(
        'change_requests.status',
        'change_requests.id',
        'change_requests.title',
        'change_requests.clientName',
        'change_requests.created_at'
      )
      .innerJoin(
        'change_requests',
        'flag_items.change_request_id',
        'change_requests.id'
      )
      .where('flag_items.user_id', user.id);
  }

  /**
   * get flagged task
   */
  static async getFlaggedTask(user) {
    if (user.role === 'Developer') {
      return await Database.table('dev_todos')
        .where('isFlagged', '1')
        .orderBy('created_at', 'desc');
    }
    return [];
  }

  /**
   * get flagged list
   */
  static async getFlaggedList(user) {
    //get task
    const flagTask = await this.getFlaggedTask(user);
    //get change request
    const flagCR = await this.getFlaggedCR(user);
    //get total change request if user is admin or devloper, else get total submited
    const totalCR =
      user.role === 'Admin' || user.role === 'Developer'
        ? await Database.from('change_requests').getCount()
        : await user.change_requests().getCount();
    return {
      flagTask,
      flagCR,
      length: flagTask.length + flagCR.length,
      totalCR
    };
  }
}

module.exports = FlagService;
