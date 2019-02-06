'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ChangeRequestMessageSchema extends Schema {
  up () {
    this.create('change_request_messages', (table) => {
      table.increments()
      table.integer('change_request_id').unsigned().references('id').inTable('change_requests').onDelete('CASCADE').onUpdate('CASCADE')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE')
      table.string('senderEmail', 100).notNullable()
      table.string('senderName', 100).notNullable()
      table.text('content','longtext')
      table.timestamps()
    })
  }

  down () {
    this.drop('change_request_messages')
  }
}

module.exports = ChangeRequestMessageSchema
