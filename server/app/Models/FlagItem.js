'use strict';

/**
 * @author Wei Zheng
 * @description Object relational model that handles all FlagItem related queries and relation
 */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class FlagItem extends Model {
  /**
   * return the belonging user
   */
  user() {
    return this.belongsTo('App/Models/User');
  }

  /**
   * return 0 if result is empty
   */
  static queryForFlag(user_id, cr_id) {
    return this.query()
      .where('user_id', user_id)
      .andWhere('change_request_id', cr_id)
      .getCount();
  }

  /**
   * delete flag item
   */
  static queryToDelete(user_id, id) {
    return this.query()
      .where('change_request_id', id)
      .andWhere('user_id', user_id)
      .delete();
  }

  /**
   * return flagged change request list
   */
  static queryForCR(user_id) {
    return this.query()
      .innerJoin(
        'change_requests',
        'flag_items.change_request_id',
        'change_requests.id'
      )
      .select(
        'change_requests.status',
        'change_requests.id',
        'change_requests.title',
        'change_requests.clientName',
        'change_requests.created_at'
      )
      .where('flag_items.user_id', user_id)
      .fetch();
  }
}

module.exports = FlagItem;
