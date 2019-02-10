'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RegistrationCodeSchema extends Schema {
  up () {
    this.create('registration_codes', (table) => {
      table.increments()
      table.string('code',100).notNullable().unique()
      table.string('creator_email', 254).notNullable()
      table.string('creator_name', 30).notNullable()
      table.string('email', 254)
      table.string('first_name',30)
      table.string('last_name',30)
      table.string('role',30).defaultTo("Client")
      table.string('mid_initial',5)
      table.string('content',999)
      table.boolean('allowEdit').defaultTo(0);
      table.timestamps()
    })
  }

  down () {
    this.drop('registration_codes')
  }
}

module.exports = RegistrationCodeSchema
