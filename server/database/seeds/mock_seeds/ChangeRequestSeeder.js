'use strict';

/*
|--------------------------------------------------------------------------
| ChangeRequestSeeder
|--------------------------------------------------------------------------
|
| Generate dummy change requests
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');
const User = use('App/Models/User');

class ChangeRequestSeeder {
  async run() {
    let users = await User.all();
    users = users.rows;
    let randUser = null;

    for (let i = 0; i < 10; i++) {
      randUser = users[Math.round(Math.random() * (users.length - 1))];

      const changeRequest = await Factory.model(
        'App/Models/ChangeRequest/ChangeRequest'
      ).create(randUser);

      await Factory.model(
        'App/Models/ChangeRequest/ChangeRequestHistory'
      ).create(changeRequest.id);

      randUser.totalRequest++;
      await randUser.save();
    }
  }
}

module.exports = ChangeRequestSeeder;
