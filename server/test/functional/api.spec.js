'use strict';
/**
 * Automative functional testing for api interface
 * run 'adonis test' to start testing
 */
const { test, trait, before, after } = use('Test/Suite')('Post');
const User = use('App/Models/User');
const Message = use('App/Models/Message');
const FlagItem = use('App/Models/FlagItem');
const Notification = use('App/Models/Notification');
const RegistrationCode = use('App/Models/RegistrationCode');
const ChangeRequest = use('App/Models/ChangeRequest/ChangeRequest');
const ChangeRequestMessage = use(
  'App/Models/ChangeRequest/ChangeRequestMessage'
);
const ChangeRequestHistory = use(
  'App/Models/ChangeRequest/ChangeRequestHistory'
);

let admin_user;
let client_user;
let change_request;
let regist_code;

trait('Auth/Client');
trait('Test/ApiClient');

/********************************
 *
 *    TEST BEGIN
 *
 *
 ********************************/
test('*TEST BEGIN* generate mock data', async () => {
  //create a admin user for testing
  admin_user = await User.create({
    full_name: 'Admin Auto Test',
    first_name: 'Admin',
    mid_initial: 'Auto',
    last_name: 'Test',
    email: 'admin@auto-test.com',
    role: 'Admin',
    password: '123456'
  });
  //create a client user for testing
  client_user = await User.create({
    full_name: 'Client Auto Test',
    first_name: 'Client',
    mid_initial: 'Auto',
    last_name: 'Test',
    email: 'client@auto-test.com',
    role: 'Client',
    password: '123456'
  });
  //create change request for testing
  change_request = await ChangeRequest.create({
    title: 'This is the title of testing request',
    details: 'This is the detail of testing request',
    totalHistory: 0,
    totalMessage: 0,
    status: 'Complete',
    clientName: client_user.full_name,
    user_id: client_user.id
  });

  regist_code = await RegistrationCode.create({
    code: '1234',
    creator_email: admin_user.email,
    creator_name: admin_user.full_name,
    email: 'code@auto-test.com',
    first_name: 'Code',
    last_name: 'Test',
    mid_initial: 'auto',
    allowEdit: false,
    role: 'Client'
  });
});

/********************************
 *
 *    Registration Process
 *
 *
 ********************************/

// test create registration code
test('create registration code  -> POST api/regist-code', async ({
  client,
  assert
}) => {
  // validate error messages when create registration code
  let response = await client
    .post('api/regist-code')
    .send({ allowEdit: true })
    .loginVia(admin_user, 'jwt')
    .end();
  response.assertStatus(200);
  response.assertJSON([
    {
      message: 'required validation failed on email',
      field: 'email',
      validation: 'required'
    }
  ]);

  response = await client
    .post('api/regist-code')
    .send({ allowEdit: true, email: 'testing@rsicrt.com', role: 'Client' })
    .loginVia(client_user, 'jwt')
    .end();
  //access forbidden
  response.assertStatus(403);

  // admin create code - correct
  response = await client
    .post('api/regist-code')
    .send({ email: 'testing@rsicrt.com', allowEdit: true, role: 'Client' })
    .loginVia(admin_user, 'jwt')
    .end();
  assert.exists(response.body.code);
  response.assertStatus(200);
});

// test verify registration code
test('verify registration code -> POST regist-code/verify/:code', async ({
  client
}) => {
  //test wrong code
  let response = await client.get(`api/regist-code/verify/${2139120}`).end();
  response.assertStatus(403);

  //test correct code
  response = await client
    .get(`api/regist-code/verify/${regist_code.code}`)
    .end();
  response.assertStatus(200);
  response.assertJSONSubset({
    code: '1234',
    creator_email: admin_user.email,
    creator_name: admin_user.full_name,
    email: 'code@auto-test.com',
    first_name: 'Code',
    last_name: 'Test',
    mid_initial: 'auto',
    allowEdit: 0,
    role: 'Client'
  });
});

// test registration
test('login user -> POST api/auth/register', async ({ client }) => {
  //mock data
  const data = {
    first_name: 'This',
    mid_initial: 'Will',
    last_name: 'NotShow',
    code: regist_code.code
  };

  //false register
  let response = await client
    .post('api/auth/register')
    .send(data)
    .end();
  response.assertStatus(200);
  response.assertError([
    {
      message: 'required validation failed on password',
      field: 'password',
      validation: 'required'
    }
  ]);

  //pass register
  data.password = '123456';
  response = await client
    .post('api/auth/register')
    .send(data)
    .end();
  response.assertStatus(200);
  response.assertJSONSubset({
    type: 'bearer'
  });
});

/********************************
 *
 *    User Controller
 *
 *
 ********************************/

// test login user
test('login user -> POST api/auth/login', async ({ client }) => {
  // test when user enter wrong password or email
  let response = await client
    .post(`api/auth/login`)
    .send({ email: 'admin@auto-test.com', password: 'wrong_password' })
    .end();
  response.assertStatus(401);
  response.assertError([
    { field: 'password', message: 'Invalid user password' }
  ]);

  //test login with correct password and email
  response = await client
    .post(`api/auth/login`)
    .send({ email: 'admin@auto-test.com', password: '123456' })
    .end();
  response.assertStatus(200);
  response.assertJSONSubset({
    type: 'bearer'
  });
});

// test get current user infromation
test('get current user information -> GET api/user', async ({ client }) => {
  //test http request
  const response = await client
    .get(`api/user`)
    .loginVia(admin_user, 'jwt')
    .end();
  response.assertStatus(200);
  response.assertJSONSubset({
    full_name: 'Admin Auto Test',
    first_name: 'Admin',
    mid_initial: 'Auto',
    last_name: 'Test',
    email: 'admin@auto-test.com',
    role: 'Admin'
  });
});

// test search user
test('search user -> POST api/user/search/all', async ({ client }) => {
  //test http request
  const response = await client
    .post(`api/user/search/all`)
    .send({ term: 'admin test', page: 1 })
    .loginVia(admin_user, 'jwt')
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    results: [
      {
        full_name: 'Admin Auto Test',
        first_name: 'Admin',
        mid_initial: 'Auto',
        last_name: 'Test',
        email: 'admin@auto-test.com',
        role: 'Admin'
      }
    ]
  });
});

// test get user by email
test('get user by email -> GET api/user/:email', async ({ client }) => {
  //test http request
  const response = await client
    .get(`api/user/admin@auto-test.com`)
    .loginVia(admin_user, 'jwt')
    .end();
  response.assertStatus(200);
  response.assertJSONSubset({
    full_name: 'Admin Auto Test',
    first_name: 'Admin',
    mid_initial: 'Auto',
    last_name: 'Test',
    email: 'admin@auto-test.com',
    role: 'Admin'
  });
});

// test delete user by id
test('delete user by id -> DELETE api/user/:id', async ({ client, assert }) => {
  //create a mock user for delete
  const mockUser = await User.create({
    full_name: 'Mock Auto Test',
    first_name: 'Mock',
    mid_initial: 'Auto',
    last_name: 'Test',
    email: 'mock@auto-test.com',
    role: 'Client',
    password: '123456'
  });

  //test client delete user. Fail
  let response = await client
    .delete(`api/user/${mockUser.id}`)
    .loginVia(client_user, 'jwt')
    .end();
  response.assertStatus(403);

  //test admin delete user. Pass
  response = await client
    .delete(`api/user/${mockUser.id}`)
    .loginVia(admin_user, 'jwt')
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    full_name: 'Mock Auto Test',
    first_name: 'Mock',
    mid_initial: 'Auto',
    last_name: 'Test',
    email: 'mock@auto-test.com',
    role: 'Client'
  });

  //test if you can get mock user
  const getMockUser = await User.find(mockUser.id);
  assert.notExists(getMockUser);
});

// test update user by id
test('update user by id -> PATCH api/user/:id', async ({ client }) => {
  //create a mock user for delete
  const mockUser = await User.create({
    full_name: 'Mock2 Auto Test',
    first_name: 'Mock2',
    mid_initial: 'Auto',
    last_name: 'Test',
    email: 'mock2@auto-test.com',
    role: 'Client',
    password: '123456'
  });

  //test client update user. Fail
  let response = await client
    .patch(`api/user/${mockUser.id}`)
    .send({ role: 'Admin' })
    .loginVia(client_user, 'jwt')
    .end();
  response.assertStatus(403);

  //test admin update user. Pass
  response = await client
    .patch(`api/user/${mockUser.id}`)
    .send({ role: 'Admin' })
    .loginVia(admin_user, 'jwt')
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    full_name: 'Mock2 Auto Test',
    first_name: 'Mock2',
    mid_initial: 'Auto',
    last_name: 'Test',
    email: 'mock2@auto-test.com',
    role: 'Admin'
  });
});

// get datatable user list
test('get datatable user list -> POST api/user/datatable', async ({
  client
}) => {
  const response = await client
    .post(`api/user/datatable`)
    .send({
      draw: '1',
      columns: [
        {
          data: 'id',
          name: '',
          searchable: 'true',
          orderable: 'true',
          search: [Object]
        },
        {
          data: 'full_name',
          name: '',
          searchable: 'true',
          orderable: 'true',
          search: [Object]
        },
        {
          data: 'role',
          name: '',
          searchable: 'true',
          orderable: 'true',
          search: [Object]
        },
        {
          data: 'email',
          name: '',
          searchable: 'true',
          orderable: 'true',
          search: [Object]
        },
        {
          data: 'totalRequest',
          name: '',
          searchable: 'true',
          orderable: 'true',
          search: [Object]
        },
        {
          data: 'created_at',
          name: '',
          searchable: 'true',
          orderable: 'true',
          search: [Object]
        }
      ],
      order: [{ column: '0', dir: 'desc' }],
      start: '0',
      length: '20',
      search: { value: 'admin test', regex: 'false' }
    })
    .loginVia(admin_user, 'jwt')
    .end();
  response.assertStatus(200);
  response.assertJSONSubset({
    data: [
      {
        full_name: 'Admin Auto Test',
        first_name: 'Admin',
        mid_initial: 'Auto',
        last_name: 'Test',
        email: 'admin@auto-test.com',
        role: 'Admin'
      }
    ]
  });
});

/********************************
 *
 *     Message Process
 *
 *
 ********************************/

// test message creation
test('user create multiple messages -> POSGT api/message', async ({
  client
}) => {
  // test message creation with wrong format
  let response = await client
    .post('api/message')
    .send({ receiver: [], title: 'hellooo' })
    .loginVia(admin_user, 'jwt')
    .end();
  //406 not acceptable
  response.assertStatus(406);

  //test correct way to create messages
  response = await client
    .post('api/message')
    .send({
      receiver: ['(admin@auto-test.com)', '(client@auto-test.com)'],
      title: 'This is from automative testing',
      content: 'I hope it will pass!'
    })
    .loginVia(admin_user, 'jwt')
    .end();
  response.assertStatus(200);
  response.assertJSON([
    {
      content: 'I hope it will pass!',
      receiverEmail: 'admin@auto-test.com',
      senderEmail: 'admin@auto-test.com',
      senderName: 'Admin Auto Test',
      title: 'This is from automative testing'
    },
    {
      content: 'I hope it will pass!',
      receiverEmail: 'client@auto-test.com',
      senderEmail: 'admin@auto-test.com',
      senderName: 'Admin Auto Test',
      title: 'This is from automative testing'
    }
  ]);
});

// test get single message
test('user get single message detail -> GET api/message/:id', async ({
  client
}) => {
  //mock data
  const data = {
    content: 'This is the test content',
    receiverEmail: 'client@auto-test.com',
    senderEmail: 'admin@auto-test.com',
    senderName: 'Admin Auto Test',
    title: 'This is the test title'
  };
  const message = await Message.create(data);

  //test http request
  const response = await client
    .get(`api/message/${message.id}`)
    .loginVia(client_user, 'jwt')
    .end();
  response.assertStatus(200);
  response.assertJSONSubset(data);
});

// test get archived message list
test('user get archived message list -> POST api/message/list', async ({
  client,
  assert
}) => {
  //mock data
  const data = new Array(2).fill({
    content: 'This is the test content',
    receiverEmail: 'admin@auto-test.com',
    senderEmail: 'client@auto-test.com',
    senderName: 'client Auto Test',
    title: 'This is the test title',
    isArchived: 1
  });
  await Message.createMany(data);

  //test http request
  const response = await client
    .post(`api/message/list`)
    .send({
      type: 'archive',
      page: 1,
      limit: 15
    })
    .loginVia(admin_user, 'jwt')
    .end();
  response.assertStatus(200);
  response.assertJSONSubset({
    total: 2,
    perPage: 15,
    page: 1,
    lastPage: 1,
    end: 2,
    start: 1
  });
  for (var i = 0; i < data.length; i++) {
    assert.include(response.body.data[i], data[i]);
  }
});

// test a user read a unread message
test('set isRead to true when a message is read by a user -> PATCH api/message/:id', async ({
  client
}) => {
  //mock data
  const data = {
    content: 'This is the test content',
    receiverEmail: 'client@auto-test.com',
    title: 'This is the test title',
    senderEmail: 'admin@auto-test.com',
    senderName: 'Admin Auto Test'
  };
  const message = await Message.create(data);

  //test http request
  const response = await client
    .patch(`api/message/${message.id}`)
    .send({ isRead: true })
    .loginVia(client_user, 'jwt')
    .end();

  data.isRead = true;
  response.assertStatus(200);
  response.assertJSONSubset(data);
});

/********************************
 *
 *      Utility Controller
 *
 *
 ********************************/

// test get menu message list
test('user get menu message list -> GET api/util/msg', async ({
  client,
  assert
}) => {
  //mock data
  const data = {
    content: 'This is the test content',
    receiverEmail: 'client@auto-test.com',
    senderEmail: 'admin@auto-test.com',
    senderName: 'Admin Auto Test',
    title: 'This is the test title',
    isBookmark: 1
  };
  await Message.create(data);

  //test http request
  const response = await client
    .get(`api/util/msg`)
    .loginVia(client_user, 'jwt')
    .end();
  response.assertStatus(200);
  assert.include(response.body.bookmark[0], data);
});

// test get menu notification list
test('user get menu notification list -> GET api/util/notification', async ({
  client
}) => {
  //mock data
  const data = {
    user_id: admin_user.id,
    content: 'This is a test',
    icon: 'fa fa-code',
    isNew: 0
  };
  await Notification.create(data);

  //test http request
  const response = await client
    .get(`api/util/notification`)
    .loginVia(admin_user, 'jwt')
    .end();
  response.assertStatus(200);
  response.assertJSONSubset({ old: [data] });
});

// test get flag item list
test('user get menu flag item list -> GET api/util/flag', async ({
  client
}) => {
  //mock data
  const data = {
    user_id: client_user.id,
    change_request_id: change_request.id,
    content: change_request.title,
    status: change_request.status
  };
  await FlagItem.create(data);

  //test http request
  const response = await client
    .get(`api/util/flag`)
    .loginVia(client_user, 'jwt')
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    flagCR: [
      {
        id: change_request.id,
        status: change_request.status,
        title: change_request.title,
        clientName: 'Client Auto Test'
      }
    ]
  });
});

// get datatable notification list
test('get datatable notification list -> POST api/util/notification/paginate', async ({
  client
}) => {
  //mock data
  const data = {
    user_id: admin_user.id,
    content: 'This is datatable test',
    icon: 'fa fa-code',
    isNew: 0
  };
  await Notification.create(data);

  const response = await client
    .post(`api/util/notification/paginate`)
    .send({
      draw: '1',
      columns: [
        {
          data: 'icon',
          name: '',
          searchable: 'true',
          orderable: 'false',
          search: [Object]
        },
        {
          data: 'isNew',
          name: '',
          searchable: 'true',
          orderable: 'false',
          search: [Object]
        },
        {
          data: 'created_at',
          name: '',
          searchable: 'true',
          orderable: 'true',
          search: [Object]
        },
        {
          data: 'content',
          name: '',
          searchable: 'true',
          orderable: 'true',
          search: [Object]
        }
      ],
      order: [{ column: '2', dir: 'desc' }],
      start: '0',
      length: '20',
      search: { value: 'This is datatable test', regex: 'false' }
    })
    .loginVia(admin_user, 'jwt')
    .end();
  response.assertStatus(200);
  response.assertJSONSubset({
    data: [data]
  });
});

/********************************
 *
 *      Change Request Controller
 *
 *
 ********************************/

//test get all change request belongs a user
test('get change request list of a user -> POST change-request/list', async ({
  client
}) => {
  const response = await client
    .post('api/change-request/list')
    .send({ tab: 'Complete' })
    .loginVia(client_user, 'jwt')
    .end();
  response.assertStatus(200);
  response.assertJSONSubset([
    {
      status: change_request.status,
      title: change_request.title,
      clientName: 'Client Auto Test'
    }
  ]);
});

//test get all change request list for admin only
test('get all change request list as admin -> POST change-request/admin/list', async ({
  client
}) => {
  // fail client
  let response = await client
    .post('api/change-request/admin/list')
    .send({ filter: change_request.id })
    .loginVia(client_user, 'jwt')
    .end();
  response.assertStatus(403);
  // pass admin
  response = await client
    .post('api/change-request/admin/list')
    .send({ filter: change_request.id })
    .loginVia(admin_user, 'jwt')
    .end();
  response.assertStatus(200);
  response.assertJSONSubset([
    {
      id: change_request.id,
      status: change_request.status,
      title: change_request.title,
      clientName: 'Client Auto Test'
    }
  ]);
});

//test get change request detail
test('get change request detail by id -> GET change-request/:id', async ({
  client
}) => {
  const response = await client
    .get(`api/change-request/${change_request.id}`)
    .loginVia(admin_user, 'jwt')
    .end();
  response.assertStatus(200);
  response.assertJSONSubset({
    id: change_request.id,
    status: change_request.status,
    title: change_request.title,
    details: change_request.details,
    clientName: 'Client Auto Test'
  });
});

//test create change request
test('create change request -> POST change-request', async ({ client }) => {
  //test validation error messages
  let response = await client
    .post(`api/change-request`)
    .loginVia(client_user, 'jwt')
    .end();
  response.assertStatus(403);
  response.assertError({
    error: 'Invalid access to request'
  });

  //test client submit request
  response = await client
    .post(`api/change-request`)
    .send({ title: 'Mock Request #1', details: 'auto test' })
    .loginVia(client_user, 'jwt')
    .end();
  response.assertStatus(200);
  response.assertJSONSubset({
    title: 'Mock Request #1',
    details: 'auto test',
    clientName: client_user.full_name,
    user_id: client_user.id
  });

  //test admin submit request for client
  response = await client
    .post(`api/change-request`)
    .send({
      client: 'client@auto-test.com',
      title: 'Mock Request #2',
      details: 'auto test'
    })
    .loginVia(admin_user, 'jwt')
    .end();
  response.assertStatus(200);
  response.assertJSONSubset({
    title: 'Mock Request #2',
    details: 'auto test',
    clientName: client_user.full_name,
    user_id: client_user.id
  });
});

//test search change request
test('search change request -> POST change-request/search/:target', async ({
  client
}) => {
  const response = await client
    .patch(`api/change-request/${change_request.id}`)
    .send({ term: change_request.id, page: 1 })
    .loginVia(admin_user, 'jwt')
    .end();
  response.assertStatus(200);
  response.assertJSONSubset({
    title: change_request.title,
    id: change_request.id,
    details: change_request.details,
    user_id: change_request.user_id
  });
});

//test update change request status/content by id
test('update change request status/content by id -> PATCH change-request/:id', async ({
  client
}) => {
  //test incorrect status
  let response = await client
    .patch(`api/change-request/${change_request.id}`)
    .send({
      status: 'adasad'
    })
    .loginVia(admin_user, 'jwt')
    .end();
  response.assertStatus(403);

  //test client change status
  response = await client
    .patch(`api/change-request/${change_request.id}`)
    .send({
      status: 'Complete'
    })
    .loginVia(client_user, 'jwt')
    .end();
  response.assertStatus(403);

  //test admin change status
  response = await client
    .patch(`api/change-request/${change_request.id}`)
    .send({
      status: 'Cancelled'
    })
    .loginVia(admin_user, 'jwt')
    .end();
  response.assertStatus(200);
  response.assertJSONSubset({
    title: change_request.title,
    id: change_request.id,
    details: change_request.details,
    user_id: change_request.user_id,
    status: 'Cancelled'
  });
});

//test flag a change request
test('flag a change request -> POST change-request/:id/flag', async ({
  client
}) => {
  const response = await client
    .post(`api/change-request/${change_request.id}/flag`)
    .loginVia(admin_user, 'jwt')
    .end();
  response.assertStatus(200);
  response.assertText('ok');
  //remove mock flag item data
  await FlagItem.query()
    .where('change_request_id', change_request.id)
    .delete();
});

//test delete change request
test('unflag a change request -> DELETE change-request/:id/unflag', async ({
  client
}) => {
  //mock data
  const data = {
    user_id: client_user.id,
    change_request_id: change_request.id,
    content: change_request.title,
    status: change_request.status
  };
  await FlagItem.create(data);

  const response = await client
    .delete(`api/change-request/${change_request.id}/unflag`)
    .loginVia(admin_user, 'jwt')
    .end();
  response.assertStatus(200);
  response.assertText('ok');
});

//test get change request message list
test('get change request message list -> GET change-request/:id/msg/:num', async ({
  client
}) => {
  //mock data
  const data = {
    change_request_id: change_request.id,
    content: 'This is cr message test',
    user_id: client_user.id,
    senderEmail: client_user.email,
    senderName: client_user.full_name
  };
  await ChangeRequestMessage.create(data);
  const response = await client
    .get(`api/change-request/${change_request.id}/msg/10`)
    .loginVia(client_user, 'jwt')
    .end();
  response.assertStatus(200);
  response.assertJSONSubset([data]);
});

//test create change request message
test('create a change request message -> POST change-request/:id/msg', async ({
  client
}) => {
  const response = await client
    .post(`api/change-request/${change_request.id}/msg`)
    .send({ content: '<p>hey</p>' })
    .loginVia(client_user, 'jwt')
    .end();
  response.assertStatus(200);
  response.assertText('ok');
});

//test get change request history list
test('get change request history list -> GET change-request/:id/hist', async ({
  client
}) => {
  //mock data
  const data = {
    change_request_id: change_request.id,
    content: 'This is cr history test',
    type: 'Test'
  };
  await ChangeRequestHistory.create(data);
  const response = await client
    .get(`api/change-request/${change_request.id}/hist`)
    .loginVia(client_user, 'jwt')
    .end();
  response.assertStatus(200);
  response.assertJSONSubset([data]);
});

/********************************
 *
 *      Test End
 *
 *
 ********************************/

//remove all mock data
test('*TEST END* delete all mock data', async () => {
  //delete mock user
  await User.query()
    .where('mid_initial', 'like', '%Auto%')
    .delete();

  //delete mock test code
  await RegistrationCode.query()
    .where('creator_name', 'like', '%Auto%')
    .delete();

  //remove mock messages
  await Message.query()
    .where('receiverEmail', 'like', '%auto-test.com%')
    .delete();

  //remove mock notifications
  await Notification.query()
    .where('content', 'like', '%Auto%')
    .delete();
});
