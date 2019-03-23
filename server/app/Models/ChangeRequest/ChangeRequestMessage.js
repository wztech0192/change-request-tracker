'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class ChangeRequestMessage extends Model {
  /**
   * return the belonging user
   */
  user() {
    return this.belongsTo('App/Models/User');
  }

  /**
   * return the belonging change request
   */
  change_request() {
    return this.belongsTo('App/Models/ChangeRequest/ChangeRequest');
  }

  /**
   * return change message list
   */
  static queryForList(id, limit) {
    return this.query()
      .where('change_request_id', id)
      .orderBy('created_at', 'desc')
      .limit(limit)
      .fetch();
  }
}

module.exports = ChangeRequestMessage;
