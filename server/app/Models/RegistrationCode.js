'use strict';

/**
 * @author Wei Zheng
 * @description Object relational model that handles all RegistrationCode related queries and relation
 */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');
const Validator = use('Validator');

class RegistrationCode extends Model {
  /**
   * set require rules for validator
   */
  static get registerRules() {
    return {
      mid_init: 'max:4',
      first_name: 'required|max:60',
      last_name: 'required|max:60',
      email: 'required|email|unique:users',
      role: 'required'
    };
  }

  static get registerEmailRules() {
    return {
      email: 'required|email|unique:users',
      role: 'required'
    };
  }

  /**
   * validate registration code information
   */
  static async isValidate(data) {
    //if allowEdit is false, validate registor information input
    if (!data.allowEdit) {
      const validation = await Validator.validateAll(data, this.registerRules);
      //return validation fail message if failed
      if (validation.fails()) {
        return validation.messages();
      }
    } else {
      //validate email input
      const emailValidate = await Validator.validate(
        data,
        this.registerEmailRules
      );
      if (emailValidate.fails()) {
        return emailValidate.messages();
      }
    }

    return 'pass';
  }
}

module.exports = RegistrationCode;
