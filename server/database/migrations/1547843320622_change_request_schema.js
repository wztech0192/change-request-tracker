'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

/**
 * Create change request database table
 */
class ChangeRequestSchema extends Schema {
  up() {
    this.create('change_requests', table => {
      table.increments();
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
      table.string('title', 254).notNullable();
      table
        .string('status', 20)
        .notNullable()
        .defaultTo('To Do');
      table.text('details', 'longtext');
      table.boolean('isFlagged').defaultTo(false);
      table.string('clientName', 100).notNullable();
      table.integer('totalMessage').defaultTo(0);
      table.integer('totalHistory').defaultTo(0);
      table.timestamps();
    });
  }

  down() {
    this.drop('change_requests');
  }
}

module.exports = ChangeRequestSchema;
