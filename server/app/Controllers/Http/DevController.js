'use strict';

/**
 * @author Wei Zheng
 * @description This controller serves as the entry & exist point to all developing related data.
 *              The controller uses DevService to provide read, add, update, as well as other related features.
 */

const VerificationHelper = use('App/Helper/VerificationHelper');
const DevService = use('App/Service/DevService');

class DevController {
  /**
   * declare services that used in this controller
   */
  constructor() {
    this.devService = new DevService();
  }

  /**
   * Get all dev ToDo and its task
   * @return {DevTodo[]}
   */
  async index({ auth }) {
    //authorize
    const user = await auth.getUser();
    VerificationHelper.verifyRole(user, ['Developer']);
    const list = await this.devService.getList();

    return list;
  }

  /**
   * verify and perform callback action
   * @return {Object}
   * @param {Func} callback call back function
   */
  async _baseCrud({ auth, request, params }, callback) {
    const user = await auth.getUser();
    //verify user role, return 404 if failed
    VerificationHelper.verifyRole(user, ['Developer']);
    const result = await callback(params.id, request);
    //verify if resource exist, return 404 if failed
    VerificationHelper.verifyExistance(result);

    return result;
  }

  /**----------------------Dev Todo CRUD--------------------------
   *
   * Create a dev Todo
   * @return {DevTodo}
   */
  async createTodo({ auth, request }) {
    const user = await auth.getUser();
    VerificationHelper.verifyRole(user, ['Developer']);
    const result = await this.devService.createTodo(request.only('content'));

    return result;
  }

  /**
   * delete target
   * @return {DevTodo}
   */
  async destroyTodo(data) {
    const result = await this._baseCrud(data, this.devService.destroyTodo);

    return result;
  }

  /**
   * update target
   * @return {DevTodo}
   */
  async updateTodo(data) {
    const result = await this._baseCrud(data, this.devService.updateTodo);

    return result;
  }

  /**----------------------Dev Task CRUD--------------------------
   *
   *
   * Create a dev task own by devTodo
   * @return {DevTask}
   */
  async createTask(data) {
    const result = await this._baseCrud(data, this.devService.createTask);

    return result;
  }

  /**
   * delete dev task from devTodo group
   * @return {DevTask}
   */
  async destroyTask(data) {
    const result = await this._baseCrud(data, this.devService.destroyTask);

    return result;
  }

  /**
   * update devTask
   * @return {devTask}
   */
  async updateTask(data) {
    const result = await this._baseCrud(data, this.devService.updateTask);

    return result;
  }

  /**
   * update task completion
   * @return {DevTask}
   */
  async updateTaskComplete(data) {
    const result = await this._baseCrud(
      data,
      this.devService.updateTaskComplete
    );

    return result;
  }

  /**----------------------Dev Tools--------------------------
   *
   * Generate number of users, for testing purpose
   */
  async generateUsers({ auth, params }) {
    const user = await auth.getUser();
    VerificationHelper.verifyRole(user, ['Developer']);
    this.devService.generateUsers(params.num);
  }

  /**
   * gennerate dummy change request, for dev
   */
  async generateChangeRequest({ auth, params }) {
    const user = await auth.getUser();
    VerificationHelper.verifyRole(user, ['Developer']);
    this.devService.generateChangeRequest(params.num, user);
  }

  /**
   * Adjust change request data, for dev
   */
  async adjustChangeRequest({ auth }) {
    const user = await auth.getUser();
    VerificationHelper.verifyRole(user, ['Developer']);
    this.devService.adjustChangeRequest();
  }
}

module.exports = DevController;
