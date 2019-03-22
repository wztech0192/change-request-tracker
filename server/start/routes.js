'use strict';

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.0/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route');
const Helpers = use('Helpers');

/**
 * API Route
 */

Route.group(() => {
  //User Authenication
  Route.post('auth/register', 'RegistrationController.register');
  Route.post('auth/login', 'UserController.login');
  Route.post(
    'regist-code/verify',
    'RegistrationController.verifyRegistrationCode'
  );
  Route.post(
    'change-request/mail-submit/:key',
    'ChangeRequestController.createFromMail'
  );

  Route.post(
    'change-request/mail-request-info/:key',
    'ChangeRequestController.mailbackCRInfo'
  );
}).prefix('api');

Route.group(() => {
  //User Route
  Route.get('user', 'UserController.self');
  Route.get('user/all', 'UserController.getAll');
  Route.get('user/flag', 'UserController.getFlaggedList');
  Route.get('user/notification', 'UserController.getNotificationList');
  Route.get('user/msg', 'UserController.getMenuMsgList');
  Route.post(
    'user/notification/paginate',
    'UserController.notificationPaginate'
  );
  Route.patch(
    'user/notification/clear-new/:target',
    'UserController.updateNotification'
  );
  Route.get('user/:email', 'UserController.get');
  Route.get('user/by-role/:role', 'UserController.getRoleList');
  Route.post('user/search/:role', 'UserController.search');
  Route.post('user/datatable', 'UserController.datatable');
  Route.delete('user/:id', 'UserController.destroy');
  Route.patch('user/:id', 'UserController.update');

  //Registration code
  Route.post('regist-code', 'RegistrationController.createRegistrationCode');

  //Developer Tool Route
  Route.get('test/generate/user/:num', 'DevController.generateUsers');
  Route.get('test/correctCR', 'DevController.adjustChangeRequest');
  Route.get('test/generate/cr/:num', 'DevController.generateChangeRequest');

  //Developer Todo Route
  Route.get('dev', 'DevController.index');
  Route.post('dev/todo', 'DevController.createTodo');
  Route.delete('dev/todo/:id', 'DevController.destroyTodo');
  Route.patch('dev/todo/:id', 'DevController.updateTodo');

  //Developer Task Route
  Route.post('dev/todo/:id/task', 'DevController.createTask');
  Route.delete('dev/task/:id', 'DevController.destroyTask');
  Route.patch('dev/task/:id', 'DevController.updateTask');
  Route.patch('dev/task/complete/:id', 'DevController.updateTaskComplete');

  //Message Route
  Route.get('message/:id', 'MessageController.getMessage');

  Route.post('message/list', 'MessageController.getMessageList');

  Route.post('message', 'MessageController.createMessage');

  Route.delete('message/:id', 'MessageController.deleteMessage');
  Route.patch('message/clear-new', 'MessageController.clearNewMessages');
  Route.patch('message/archive', 'MessageController.archiveMessage');
  Route.patch('message/:id', 'MessageController.updateMessage');

  //Change Request Route
  Route.post('change-request/list', 'ChangeRequestController.index');
  Route.post(
    'change-request/admin/list',
    'ChangeRequestController.getRequestList'
  );
  Route.get(
    'change-request/chart/:range',
    'ChangeRequestController.getChartData'
  );
  Route.get('change-request/:id', 'ChangeRequestController.detail');
  Route.post('change-request', 'ChangeRequestController.create');
  Route.delete('change-request/:id', 'ChangeRequestController.destroy');
  Route.patch('change-request/:id', 'ChangeRequestController.update');
  Route.post('change-request/search/:target', 'ChangeRequestController.search');

  //Flag and UnFlag Change Request
  Route.delete(
    'change-request/:id/unflag',
    'ChangeRequestController.unflagChangeRequest'
  );
  Route.post(
    'change-request/:id/flag',
    'ChangeRequestController.flagChangeRequest'
  );

  //Change Request Message Route
  Route.get(
    'change-request/:id/msg/:num',
    'ChangeRequestController.getCRMessage'
  );
  Route.post(
    'change-request/:id/msg',
    'ChangeRequestController.createCRMessage'
  );
  Route.delete(
    'change-request/msg/:id',
    'ChangeRequestController.destroyCRMessage'
  );
  Route.patch(
    'change-request/msg/:id',
    'ChangeRequestController.updateCRMessage'
  );

  //Change Request History Route
  Route.get('change-request/:id/hist', 'ChangeRequestController.getCRHistory');
})
  .middleware('auth')
  .prefix('api');

Route.any('*', ({ response }) =>
  response.download(Helpers.publicPath('index.html'))
);
