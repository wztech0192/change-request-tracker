'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class ChangeRequest extends Model {

  /**
   * return the belonging user
   */
  user() {
    return this.belongsTo('App/Models/User');
  }

  /**
   * return all messages in this change request
   */
  messages() {
    return this.hasMany('App/Models/ChangeRequest/ChangeRequestMessage')
  }

  /**
   * return all history in this change request
   */
  history() {
    return this.hasMany('App/Models/ChangeRequest/ChangeRequestHistory')
  }
}

module.exports = ChangeRequest
