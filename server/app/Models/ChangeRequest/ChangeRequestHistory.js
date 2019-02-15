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
}

module.exports = ChangeRequestHistory;
