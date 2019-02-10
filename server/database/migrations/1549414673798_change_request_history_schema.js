'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ChangeRequestHistorySchema extends Schema {
  up () {
    this.create('change_request_histories', (table) => {
      table.increments()
      table.integer('change_request_id').unsigned().references('id').inTable('change_requests').onDelete('CASCADE').onUpdate('CASCADE')
      table.text('content','longtext')
      table.string('type',12);
      table.timestamps()
    })
  }

  down () {
    this.drop('change_request_histories')
  }
}

module.exports = ChangeRequestHistorySchema
