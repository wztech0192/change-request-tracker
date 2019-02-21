'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class NotificationSchema extends Schema {
  up() {
    this.create('notifications', table => {
      table.increments();
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
      table.integer('change_request_id').defaultTo(-1);
      table.string('notes', 254).notNullable();
      table.boolean('isRead').defaultTo(false);
      table.boolean('isPop').defaultTo(false);
      table.timestamps();
    });
  }

  down() {
    this.drop('notifications');
  }
}

module.exports = NotificationSchema;
