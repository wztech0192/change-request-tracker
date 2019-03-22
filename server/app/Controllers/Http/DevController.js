'use strict';

/**
 * @author Wei Zheng
 * @description create, read, update, and delete for developer todo, developer task, and developer reference
 */

const VerificationHelper = use('App/Helper/VerificationHelper');
const DevService = use('App/Service/DevService');

class DevController {
  constructor() {
    this.devService = new DevService();
  }

  /**
   * Get all dev ToDo and its task
   * @returns {Object}
   */
  async index({ auth }) {
    //authorize
    const user = await auth.getUser();
    VerificationHelper.verifyRole(user, ['Developer']);
    return await this.devService.getList();
  }

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
   * @returns {devTodo}
   */
  async createTodo({ auth, request }) {
    const user = await auth.getUser();
    VerificationHelper.verifyRole(user, ['Developer']);
    return await this.devService.createTodo(request.only('content'));
  }

  /**
   * delete target
   * @returns {devTodo}
   */
  async destroyTodo(data) {
    return this._baseCrud(data, this.devService.destroyTodo);
  }

  /**
   * update target
   * @returns {devTodo}
   */
  async updateTodo(data) {
    return this._baseCrud(data, this.devService.updateTodo);
  }

  /**----------------------Dev Task CRUD--------------------------
   *
   *
   * Create a dev task own by devTodo
   * @returns {devTask}
   */
  async createTask(data) {
    return this._baseCrud(data, this.devService.createTask);
  }

  /**
   * delete target
   * @returns {devTask}
   */
  async destroyTask(data) {
    return this._baseCrud(data, this.devService.destroyTask);
  }

  /**
   * update target
   * @returns {devTask}
   */
  async updateTask(data) {
    return this._baseCrud(data, this.devService.updateTask);
  }

  /**
   * update task completion
   * @returns {devTask}
   */
  async updateTaskComplete(data) {
    return this._baseCrud(data, this.devService.updateTaskComplete);
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
