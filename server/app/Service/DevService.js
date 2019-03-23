'use strict';

/**
 * @author Wei Zheng
 * @description dev service
 */

const User = use('App/Models/User');
const DevTodo = use('App/Models/Dev/DevTodo');
const DevTask = use('App/Models/Dev/DevTask');
const ChangeRequestService = use('App/Service/ChangeRequestService');


class DevService {
  constructor() {
    this.changeRequestService = new ChangeRequestService();
    this.ltr = 'abcdefghijklmnopqrstuvwxyz';
  }

  /**----------------------Dev Todo CRUD--------------------------
   * Get all dev ToDo and its task
   * @returns {Object}
   */
  async getList() {
    //get all todoList from database
    const todoList = await DevTodo.all();

    //get all children task of each todo
    for (let todo of todoList.rows) {
      const task = await todo.devTask().fetch();
      todo.tasks = task;
    }
    return todoList.rows;
  }

  /**
   * Create a dev Todo
   * @returns { devTodo }
   */
  createTodo(content) {
    return DevTodo.create(content);
  }

  /**
   * delete target
   * @returns {devTodo}
   */
  async destroyTodo(id) {
    const devTodo = await DevTodo.find(id);
    if (!devTodo) return null;
    return devTodo.delete();
  }

  /**
   * update target
   * @returns {devTodo}
   */
  async updateTodo(id, request) {
    const devTodo = await DevTodo.find(id);
    if (!devTodo) return null;
    devTodo.merge(request.only(['content', 'percentage', 'isFlagged']));
    return devTodo.save();
  }
  /**----------------------Dev Task CRUD--------------------------
   *
   *
   * Create a dev task own by devTodo
   * @returns {devTask}
   */
  async createTask(id, request) {
    const devTodo = await DevTodo.find(id);
    if (!devTodo) return null;

    //update todo complete percentage
    let old_task_num = devTodo.task_num;
    devTodo.task_num++;
    // total of completed divide by new total of task
    devTodo.percentage = Math.round(
      (old_task_num * devTodo.percentage) / devTodo.task_num
    );
    await devTodo.save();

    const data = request.only('content');
    data.dev_todo_id = devTodo.id;
    return DevTask.create(data);
  }

  /**
   * delete target
   * @returns {devTask}
   */
  async destroyTask(id) {
    const devTask = await DevTask.find(id);
    if (!devTask) return null;

    const parent = await devTask.devTodo().fetch();
    const old_task_num = parent.task_num;
    //is devtask is completed then decrease total percetange
    if (devTask.isCompleted) {
      let dPercent = (1 / old_task_num) * 100;
      parent.percentage -= dPercent;
    }
    //determine percetange after item is deleted
    parent.task_num--;
    // total of completed divide by new total of task
    if (parent.task_num === 0) {
      parent.percentage === 0;
    } else {
      parent.percentage = Math.round(
        (old_task_num * parent.percentage) / parent.task_num
      );
    }
    await parent.save();

    return await devTask.delete();
  }

  /**
   * update target
   * @returns {devTask}
   */
  async updateTask(id, request) {
    const devTask = await DevTask.find(id);
    if (!devTask) return null;
    devTask.merge(request.only(['content']));
    return devTask.save();
  }

  /**
   * update task completion
   * @returns {devTask}
   */
  async updateTaskComplete(id, request) {
    const devTask = await DevTask.find(id);
    if (!devTask) return null;
    devTask.merge(request.only(['isCompleted']));
    await devTask.save();

    //recalculate parent todo complete percentage
    const parentTodo = await devTask.devTodo().fetch();
    let dPercent = (1 / parentTodo.task_num) * 100;
    //determine increasing or decreasing on percentage
    dPercent = devTask.isCompleted ? dPercent : -dPercent;
    parentTodo.percentage += dPercent;
    parentTodo.percentage = Math.round(parentTodo.percentage);
    if (parentTodo.percentage >= 100) {
      parentTodo.percentage = 100;
    } else if (parentTodo.percentage < 0) {
      parentTodo.percentage = 0;
    }

    return parentTodo.save();
  }

  /* ------------------Dev Tool Method---------------
   *
   *
   *generate random letter by length
   */
  _getLTR(length) {
    let str = '';
    for (let i = 0; i < length; i++) {
      str += this.ltr.charAt(Math.round(Math.random() * (this.ltr.length - 1)));
    }
    return str;
  }

  /**
   * Generate number of users, for testing purpose
   */
  async generateUsers(num) {
    if (num > 0) {
      const usersList = new Array(num);
      for (let i = 0; i < num; i++) {
        let email = this._getLTR(6) + '@' + this._getLTR(4) + '.com';

        let password = this._getLTR(8);
        let role = 'Client';
        let first_name = this._getLTR(6);
        let mid_initial = 'T.';
        let last_name = this._getLTR(6);
        let full_name = `${first_name} ${mid_initial || ''} ${last_name}`;
        usersList[i] = {
          email,
          full_name,
          password,
          role,
          first_name,
          mid_initial,
          last_name
        };
      }
      await User.createMany(usersList);
      return 'OK';
    }
  }

  /**
   * Adjust change request data, for dev
   */
  async adjustChangeRequest() {
    this.changeRequestService.adjustChangeRequest();
  }

  /**
   * gennerate dummy change request, for dev
   */
  async generateChangeRequest(num, issuer) {
    let users = await User.all();
    users = users.rows;
    let randUser = null;
    for (let i = 0; i < num; i++) {
      randUser = users[Math.round(Math.random() * (users.length - 1))];
      //create new change request
      this.changeRequestService.create(
        {
          totalMessage: 0,
          totalHistory: 0,
          clientName: `${randUser.full_name}`,
          title: 'This is random generated change request #' + i,
          details: 'g.'
        },
        randUser,
        issuer
      );
    }
  }
}

module.exports = DevService;
