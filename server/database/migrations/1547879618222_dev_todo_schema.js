'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class DevTodoSchema extends Schema {
  up () {
    this.create('dev_todos', (table) => {
      table.increments()
      table.float('percentage').defaultTo(0);
      table.string('content',200)
      table.timestamps()
    })
  }

  down () {
    this.drop('dev_todos')
  }
}

module.exports = DevTodoSchema
