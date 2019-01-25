'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class DevTodoSchema extends Schema {
  up () {
    this.table('dev_todos', (table) => {
      table.integer('task_num').defaultTo(0);
      table.boolean('isFlagged').defaultTo(false);
    })
  }

  down () {
    this.table('dev_todos', (table) => {
      // reverse alternations
    })
  }
}

module.exports = DevTodoSchema
