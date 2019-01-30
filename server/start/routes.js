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
}).prefix('api')

Route.group(() => {
    //User Route
    Route.get('user','UserController.self')
    Route.get('user/all', "UserController.getAll")
    Route.get('user/flagged', "UserController.getFlaggedList")
    Route.get('user/:id', "UserController.get")
    Route.delete('user/:id', "UserController.destroy")
    Route.patch('user/:id', "UserController.update")
  
  
    //Developer Todo Route
    Route.get('dev',"DevController.index")
    Route.post('dev/todo',"DevController.createTodo")
    Route.delete('dev/todo/:id',"DevController.destroyTodo")
    Route.patch('dev/todo/:id',"DevController.updateTodo")
    
    //Developer Task Route
    Route.post('dev/todo/:id/task',"DevController.createTask")
    Route.delete('dev/task/:id',"DevController.destroyTask")
    Route.patch('dev/task/:id',"DevController.updateTask")
    Route.patch('dev/task/complete/:id',"DevController.updateTaskComplete")
  
    //Developer Reference Route
    Route.get('dev/ref',"DevController.getRef")
    Route.post('dev/ref',"DevController.createRef")
    Route.delete('dev/ref/:id',"DevController.destroyRef")
    Route.patch('dev/ref/:id',"DevController.updateRef")
  
    //Change Request Route
    Route.get('change-request', "ChangeRequestController.index")
    Route.post('change-request', "ChangeRequestController.create")
    Route.delete('change-request/:id', "ChangeRequestController.destroy")
    Route.patch('change-request/:id', "ChangeRequestController.update")
    Route.get('change-request/all', "ChangeRequestController.getAll")
}).middleware('auth').prefix('api');
