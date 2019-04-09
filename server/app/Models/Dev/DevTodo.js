'use strict';

/**
 * @author Wei Zheng
 * @description Object relational model that handles all DevTodo related queries and relation
 */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class DevTodo extends Model {
  /**
   * return all change request belongs to this user
   */
  devTask() {
    return this.hasMany('App/Models/Dev/DevTask');
  }

  /**
   * return flagged todos
   */
  static queryForFlag() {
    return this.query()
      .where('isFlagged', '1')
      .orderBy('created_at', 'desc')
      .fetch();
  }
}

module.exports = DevTodo;
