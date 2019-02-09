'use strict'

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
const Route = use('Route')
const Helpers = use('Helpers')

/**
 * API Route
 */
Route.group(() => {
  //User Authenication
  Route.post('auth/register', "UserController.register");
  Route.post('auth/login', "UserController.login");
  Route.post('regist-code/verify', "RegistrationCodeController.verifyRegistrationCode");
}).prefix('api')

Route.group(() => {
  //User Route
  Route.get('user', 'UserController.self')
  Route.get('user/all', "UserController.getAll")
  Route.get('user/task', "UserController.getTaskList")
  Route.get('user/:id', "UserController.get")
  Route.delete('user/:id', "UserController.destroy")
  Route.patch('user/:id', "UserController.update")

  //Registration code
  Route.get('regist-code', "RegistrationCodeController.getRegistrationCode")
  Route.post('regist-code', "RegistrationCodeController.createRegistrationCode")
  Route.delete('regist-code/:id', "RegistrationCodeController.deleteRegistrationCode")
  Route.patch('regist-code/:id', "RegistrationCodeController.updateRegistrationCode")


  //Developer Todo Route
  Route.get('dev', "DevController.index")
  Route.post('dev/todo', "DevController.createTodo")
  Route.delete('dev/todo/:id', "DevController.destroyTodo")
  Route.patch('dev/todo/:id', "DevController.updateTodo")

  //Developer Task Route
  Route.post('dev/todo/:id/task', "DevController.createTask")
  Route.delete('dev/task/:id', "DevController.destroyTask")
  Route.patch('dev/task/:id', "DevController.updateTask")
  Route.patch('dev/task/complete/:id', "DevController.updateTaskComplete")

  //Developer Reference Route
  Route.get('dev/ref', "DevController.getRef")
  Route.post('dev/ref', "DevController.createRef")
  Route.delete('dev/ref/:id', "DevController.destroyRef")
  Route.patch('dev/ref/:id', "DevController.updateRef")

  //Message Route
  Route.get('message', "MessageController.getMessage")
  Route.post('message', "MessageController.createMessage")
  Route.delete('message/:id', "MessageController.deleteMessage")
  Route.patch('message/:id', "MessageController.updateMessage")

  //Change Request Route
  Route.get('change-request', "ChangeRequestController.index")
  Route.get('change-request/all', "ChangeRequestController.getAll")
  Route.get('change-request/:id', "ChangeRequestController.detail")
  Route.post('change-request', "ChangeRequestController.create")
  Route.delete('change-request/:id', "ChangeRequestController.destroy")
  Route.patch('change-request/:id', "ChangeRequestController.update")

  //Change Request Message Route
  Route.get('change-request/:id/msg', "ChangeRequestController.getCRMessage")
  Route.post('change-request/:id/msg', "ChangeRequestController.createCRMessage")
  Route.delete('change-request/msg/:id', "ChangeRequestController.destroyCRMessage")
  Route.patch('change-request/msg/:id', "ChangeRequestController.updateCRMessage")

}).middleware('auth').prefix('api');

Route.any('*', ({response}) => response.download(Helpers.publicPath('index.html')))
