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


Route.get('/', () => {
  return {
    greeting: 'Hello world in JSON'
  }
})

/**
 * API Route
 */
Route.group(() => {

  //User Authenication
  Route.post('auth/register', "UserController.register");
  Route.post('auth/login', "UserController.login");

  //User Route
  Route.get('user','UserController.self').middleware('auth');
  Route.get('user/all', "UserController.getAll").middleware('auth');
  Route.get('user/:id', "UserController.get").middleware('auth');
  Route.delete('user/:id', "UserController.destroy").middleware('auth');
  Route.patch('user/:id', "UserController.update").middleware('auth');

  //Developer Todo Route
  Route.get('dev',"DevController.index").middleware('auth');
  Route.post('dev/todo',"DevController.createTodo").middleware('auth');
  Route.delete('dev/todo/:id',"DevController.destroyTodo").middleware('auth');
  Route.patch('dev/todo/:id',"DevController.updateTodo").middleware('auth');
  
  //Developer Task Route
  Route.post('dev/todo/:id/task',"DevController.createTask").middleware('auth');
  Route.delete('dev/task/:id',"DevController.destroyTask").middleware('auth');
  Route.patch('dev/task/:id',"DevController.updateTask").middleware('auth');
  Route.patch('dev/task/complete/:id',"DevController.updateTaskComplete").middleware('auth');

  //Developer Reference Route
  Route.get('dev/ref',"DevController.getRef").middleware('auth');
  Route.post('dev/ref',"DevController.createRef").middleware('auth');
  Route.delete('dev/ref/:id',"DevController.destroyRef").middleware('auth');
  Route.patch('dev/ref/:id',"DevController.updateRef").middleware('auth');

  //Change Request Route
  Route.get('change-request', "ChangeRequestController.index").middleware('auth');
  Route.post('change-request', "ChangeRequestController.create").middleware('auth');
  Route.delete('change-request/:id', "ChangeRequestController.destroy").middleware('auth');
  Route.patch('change-request/:id', "ChangeRequestController.update").middleware('auth');
  Route.get('change-request/all', "ChangeRequestController.getAll").middleware('auth');

}).prefix('api')
