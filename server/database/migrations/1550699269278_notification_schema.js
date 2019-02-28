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
      table.string('content', 254).notNullable();
      table.string('icon', 64);
      table.boolean('isNew').defaultTo(true);
      table.string('link', 254).defaultTo(null);
      table.timestamps();
    });
  }

  down() {
    this.drop('notifications');
  }
}

module.exports = NotificationSchema;
