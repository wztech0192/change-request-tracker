'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash');

class User extends Model {
  static boot() {
    super.boot();

    /**
     * A hook to hash the user password before saving
     * it to the database.
     */
    this.addHook('beforeSave', async userInstance => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password);
      }
    });
  }

  /**
   * set require rules for validator
   */
  static get registerRules() {
    return {
      email: 'required|email|unique:users',
      password: 'required|min:6|max:30',
      mid_initial: 'max:30',
      first_name: 'required|max:30',
      last_name: 'required|max:30'
    };
  }
  /**
   * set require rules for validator
   */
  static get changeRules() {
    return {
      username: 'unique:users',
      email: 'email|unique:users',
      password: 'min:6|max:30'
    };
  }

  /**
   * Hide password field
   */
  static get hidden() {
    return ['password'];
  }

  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */
  tokens() {
    return this.hasMany('App/Models/Token');
  }

  /**
   * return all change request belongs to this user
   */
  change_requests() {
    return this.hasMany('App/Models/ChangeRequest/ChangeRequest');
  }

  /**
   * return all change request messages belongs to this user
   */
  change_requests_messages() {
    return this.hasMany('App/Models/ChangeRequest/ChangeRequestMessage');
  }

  /**
   * return all notifications belongs to this user
   */
  notifications() {
    return this.hasMany('App/Models/Notification');
  }
}

module.exports = User;
