'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class RegistrationCode extends Model {

  /**
   * set require rules for validator
   */
  static get registerRules() {
    return {
      mid_init: 'max:4',
      first_name: 'required|max:60',
      last_name: 'required|max:60',
      email: 'required|email|unique:users'
    }
  }

  static get registerEmailRules(){
    return{
      email: 'required|email|unique:users'
    }
  }
}

module.exports = RegistrationCode
