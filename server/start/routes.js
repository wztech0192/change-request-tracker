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

  //User Route
  Route.post('auth/register', "UserController.register");
  Route.post('auth/login', "UserController.login");
  Route.get('user', "UserController.index").middleware('auth');
  Route.delete('user/:id', "UserController.destroy").middleware('auth');
  Route.patch('user/:id', "UserController.update").middleware('auth');


  //Change Request Route
  Route.get('change-request', "ChangeRequestController.index").middleware('auth');
  Route.post('change-request', "ChangeRequestController.create").middleware('auth');
  Route.delete('change-request/:id', "ChangeRequestController.destroy").middleware('auth');
  Route.patch('change-request/:id', "ChangeRequestController.update").middleware('auth');

}).prefix('api')
