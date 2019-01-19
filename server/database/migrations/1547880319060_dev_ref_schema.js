'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class DevRefSchema extends Schema {
  up () {
    this.create('dev_refs', (table) => {
      table.increments()
      table.string('description')
      table.string('link')
      table.timestamps()
    })
  }

  down () {
    this.drop('dev_refs')
  }
}

module.exports = DevRefSchema
