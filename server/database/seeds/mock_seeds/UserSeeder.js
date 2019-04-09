'use strict';

/*
|--------------------------------------------------------------------------
| UserSeeder
|--------------------------------------------------------------------------
|
| Generate dummy user
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');

class UserSeeder {
  async run() {
    await Factory.model('App/Models/User').createMany(20);
  }
}

module.exports = UserSeeder;
