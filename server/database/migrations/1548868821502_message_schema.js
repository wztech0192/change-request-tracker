'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class MessageSchema extends Schema {
  up() {
    this.create('messages', table => {
      table.increments();
      table.string('senderEmail', 100).notNullable();
      table.string('senderName', 100).notNullable();
      table.string('receiverEmail', 100).notNullable();
      table.string('title', 254).notNullable();
      table.text('content', 'longtext').notNullable();
      table.boolean('isRead').defaultTo(false);
      table.boolean('isBookmark').defaultTo(false);

      table.boolean('isArchived').defaultTo(false);
      table.timestamps();
    });
  }

  down() {
    this.drop('messages');
  }
}

module.exports = MessageSchema;
