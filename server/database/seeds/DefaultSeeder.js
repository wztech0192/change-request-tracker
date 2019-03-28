'use strict';

/*
|--------------------------------------------------------------------------
| DefaultSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const User = use('App/Models/User');

//default developer account
class DefaultSeeder {
  async run() {
    const data = {
      full_name: '~ CRTracker ~',
      first_name: '~',
      mid_initial: 'CRTracker',
      last_name: '~',
      email: 'no-reply@rsicrt.com',
      role: 'Developer',
      password: 'weijie0192',
      isDev: true
    };

    await User.create(data);
  }
}

module.exports = DefaultSeeder;
