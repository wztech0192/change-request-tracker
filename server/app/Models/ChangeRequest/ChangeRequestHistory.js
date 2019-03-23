'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class ChangeRequestHistory extends Model {
  /**
   * return the belonging change request
   */
  change_request() {
    return this.belongsTo('App/Models/ChangeRequest/ChangeRequest');
  }

  /**
   * return change request history list
   */
  static queryForList(id) {
    return this.query()
      .where('change_request_id', id)
      .orderBy('created_at', 'desc')
      .fetch();
  }
}

module.exports = ChangeRequestHistory;
