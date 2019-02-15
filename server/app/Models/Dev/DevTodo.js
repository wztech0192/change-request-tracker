'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class DevTodo extends Model {
  /**
   * return all change request belongs to this user
   */
  devTask() {
    return this.hasMany('App/Models/Dev/DevTask');
  }
}

module.exports = DevTodo;
