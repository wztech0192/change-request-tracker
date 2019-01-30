'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class DevTaskSchema extends Schema {
  up () {
    this.create('dev_tasks', (table) => {
      table.increments()
      table.integer('dev_todo_id').unsigned().references('id').inTable('dev_todos')
      table.boolean('isCompleted').defaultTo(false)
      table.string('content',200)
      table.timestamps()
    })
  }

  down () {
    this.drop('dev_tasks')
  }
}

module.exports = DevTaskSchema
