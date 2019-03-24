'use strict';

/*
|--------------------------------------------------------------------------
| Factory
|--------------------------------------------------------------------------
|
| Factories are used to define blueprints for database tables or Lucid
| models. Later you can use these blueprints to seed your database
| with dummy data.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');
const Hash = use('Hash');
const User = use('App/Models/User');

//Create Dummy User
Factory.blueprint('App/Models/User', async faker => {
  const full_name = faker.name({ middle_initial: true });
  const splitName = full_name.split(' ');
  return {
    full_name,
    first_name: splitName[0],
    mid_initial: splitName[1],
    last_name: splitName[2],
    email: faker.email(),
    role: 'Client',
    password: await Hash.make(faker.password())
  };
});

//Create Dummy Change Request
Factory.blueprint(
  'App/Models/ChangeRequest/ChangeRequest',
  (faker, i, data) => {
    return {
      title: faker.paragraph({ sentences: 1 }),
      details: faker.paragraph(),
      totalHistory: 1,
      totalMessage: 0,
      clientName: data.full_name,
      user_id: data.id
    };
  }
);

//Create Dummy Change Request
Factory.blueprint(
  'App/Models/ChangeRequest/ChangeRequestHistory',
  (faker, i, id) => {
    return {
      type: 'Create',
      content: 'Seed Generated!!!!!',
      change_request_id: id
    };
  }
);
