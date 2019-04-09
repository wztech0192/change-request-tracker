'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

/**
 * Create user database table
 */
class UserSchema extends Schema {
  up() {
    this.create('users', table => {
      table.increments();
      table
        .string('email', 254)
        .notNullable()
        .unique();
      table.string('password', 60).notNullable();
      table.string('role', 30).defaultTo('Client');
      table.boolean('isDev').defaultTo(false);
      table.string('first_name', 30).notNullable();
      table.string('last_name', 30).notNullable();
      table.string('mid_initial', 30);
      table.string('full_name', 90).notNullable();
      table.timestamps();
    });
  }

  down() {
    this.drop('users');
  }
}

module.exports = UserSchema;
