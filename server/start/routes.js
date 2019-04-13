'use strict';

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to the web application. Each route is binded to a Controller method.
|
| Please see CRT API Documentation for more information about what each route does
| Visit CRT Web App and go to /document/web-api
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route');
const Helpers = use('Helpers');

/**
 * Un-Authenticated Routes
 */
Route.group(() => {
  /****** User Controller ******/
  Route.post('auth/login', 'UserController.login');

  /****** Registration Controller ******/
  Route.post('auth/register', 'RegistrationController.register');
  Route.get(
    'regist-code/verify/:code',
    'RegistrationController.verifyRegistrationCode'
  );

  /******  Change Request Controller ******/
  Route.post(
    'change-request/mail-submit/:key',
    'ChangeRequestController.createFromMail'
  );
  Route.post(
    'change-request/mail-request-info/:key',
    'ChangeRequestController.mailbackCRInfo'
  );

  /******  Utility Controller ******/
  Route.get('download/CRViewer.zip', 'UtilityController.getCRViewer');
  Route.get('download/CRT_UserManual.pdf', 'UtilityController.getUserManual');
}).prefix('api');

/**
 * Authenticated routes that requires JWT Token
 */
Route.group(() => {
  /****** Utility Controller ******/
  Route.get('util/flag', 'UtilityController.getFlaggedList');
  Route.get('util/notification', 'UtilityController.getNotificationList');
  Route.get('util/msg', 'UtilityController.getMenuMsgList');
  Route.post(
    'util/notification/paginate',
    'UtilityController.notificationPaginate'
  );
  Route.put(
    'util/notification/clear-new/:target',
    'UtilityController.updateNotification'
  );
  Route.patch(
    'util/notification/clear-new/:target',
    'UtilityController.updateNotification'
  );

  /****** User Controller ******/
  Route.get('user', 'UserController.self');
  Route.get('user/:email', 'UserController.get');
  Route.post('user/search/:role', 'UserController.search');
  Route.post('user/datatable', 'UserController.datatable');
  Route.delete('user/:id', 'UserController.destroy');
  Route.put('user/:id', 'UserController.update');
  Route.patch('user/:id', 'UserController.update');

  /****** Registration Controller ******/
  Route.post('regist-code', 'RegistrationController.createRegistrationCode');

  /****** Dev Controller ******/
  //Developer Tool Route
  Route.get('test/generate/user/:num', 'DevController.generateUsers');
  Route.get('test/correctCR', 'DevController.adjustChangeRequest');
  Route.get('test/generate/cr/:num', 'DevController.generateChangeRequest');

  //Developer Todo Route
  Route.get('dev', 'DevController.index');
  Route.post('dev/todo', 'DevController.createTodo');
  Route.delete('dev/todo/:id', 'DevController.destroyTodo');
  Route.put('dev/todo/:id', 'DevController.updateTodo');
  Route.patch('dev/todo/:id', 'DevController.updateTodo');

  //Developer Task Route
  Route.post('dev/todo/:id/task', 'DevController.createTask');
  Route.delete('dev/task/:id', 'DevController.destroyTask');
  Route.put('dev/task/:id', 'DevController.updateTask');
  Route.patch('dev/task/:id', 'DevController.updateTask');
  Route.put('dev/task/complete/:id', 'DevController.updateTaskComplete');
  Route.patch('dev/task/complete/:id', 'DevController.updateTaskComplete');

  /****** Message Controller ******/
  Route.get('message/:id', 'MessageController.getMessage');
  Route.post('message/list', 'MessageController.getMessageList');
  Route.post('message', 'MessageController.createMessage');
  Route.put('message/clear-new', 'MessageController.clearNewMessages');
  Route.put('message/archive', 'MessageController.archiveMessage');
  Route.put('message/:id', 'MessageController.updateMessage');
  Route.patch('message/clear-new', 'MessageController.clearNewMessages');
  Route.patch('message/archive', 'MessageController.archiveMessage');
  Route.patch('message/:id', 'MessageController.updateMessage');

  /****** Change Request Controller ******/
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
  Route.put('change-request/:id', 'ChangeRequestController.update');
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

  //Change Request History Route
  Route.get('change-request/:id/hist', 'ChangeRequestController.getCRHistory');
})
  .middleware('auth')
  .prefix('api');

Route.any('*', ({ response }) =>
  response.download(Helpers.publicPath('index.html'))
);
