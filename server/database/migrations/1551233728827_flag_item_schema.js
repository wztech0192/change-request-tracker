'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class FlagItemSchema extends Schema {
  up() {
    this.create('flag_items', table => {
      table.increments();
      ``;
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
      table.integer('change_request_id').defaultTo(-1);
      table.string('content', 200);
      table.string('status', 64);
      table.timestamps();
    });
  }

  down() {
    this.drop('flag_items');
  }
}

module.exports = FlagItemSchema;
