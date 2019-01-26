/**
 * Store Dev Todo information details
 */

import HTTP from '../http';
import router from '../router';

export default {
  namespaced: true,
  state: {
    // array of todo list
    todoList: null,
    errorMsg: null,
    todoType: "ALL"
  },

  actions: {
    // fetch dev todo list
    fetchDevTodo({ commit, state }) {
      return HTTP().get('/dev', {
        // request params to pass data from get requests
        params: {
          type: state.todoType
        }
      })
        // if user exist set user information in state, else set error message then redirect to login view
        .then(({ data }) => {
          if (data) {
            commit('setTodoList', data);
          } else {
            commit('setExceptionError', "Cannot find the user. Try to Re-login.");
            router.push('/login');
          }
        })
        .catch(() => {
          commit('setTodoList', null);
          // commit('setExceptionError', "Cannot find the user. Try to Re-login.");
          //  router.push('/login');
        });
    },

    // add todo
    addNewTodo({ commit }, newItem) {
      return HTTP().post('/dev/todo', {
        title: newItem
      })
        .then(() => {
          // refresh devtodo
          //  dispatch('fetchDevTodo');
        }).catch(() => {
          commit('setErrorMsg', "There is a connection issue");
        });
    },

    // add task, param: object contains id and detail
    addNewTask({ commit, dispatch }, newTask) {
      return HTTP().post(`/dev/todo/${newTask.id}/task`, newTask)
        .then(() => {
          // refresh devtodo
          dispatch('fetchDevTodo');
        }).catch(() => {
          commit('setErrorMsg', "There is a connection issue");
        });
    },

    // delete todo
    deleteTodo({ commit, dispatch }, id) {
      return HTTP().delete(`/dev/todo/${id}`)
        .then(() => {
          // refresh devtodo
          dispatch('fetchDevTodo');
        }).catch(() => {
          commit('setErrorMsg', "There is a connection issue");
        });
    },

    // delete task
    deleteTask({ commit, dispatch }, id) {
      return HTTP().delete(`/dev/task/${id}`)
        .then(() => {
          // refresh devtodo
          dispatch('fetchDevTodo');
        }).catch(() => {
          commit('setErrorMsg', "There is a connection issue");
        });
    },

    // edit todo
    editTodo({ commit, dispatch }, todo) {
      return HTTP().patch(`/dev/todo/${todo.id}`, todo)
        .then(() => {
          // refresh devtodo
          dispatch('fetchDevTodo');
        }).catch(() => {
          commit('setErrorMsg', "There is a connection issue");
        });
    },

    // edit task
    editTask({ commit, dispatch }, task) {
      return HTTP().patch(`/dev/task/${task.id}`, task)
        .then(() => {
          // refresh devtodo
          dispatch('fetchDevTodo');
        }).catch(() => {
          commit('setErrorMsg', "There is a connection issue");
        });
    },
    // set task status
    setTaskStatus({ commit }, { task, todo }) {
      commit("setTaskCompleted", task);
      // http request returns calculated percent of todo
      commit("setTodoPercentage", { todo, isCompleted: task.isCompleted });
      return HTTP().patch(`/dev/task/complete/${task.id}`, task).catch(() => {
        commit('setErrorMsg', "There is a connection issue");
      });
    },

    // set flag
    setTodoFlag({ commit }, todo) {
      commit('setFlag', todo);
      return HTTP().patch(`/dev/todo/${todo.id}`, todo)
        .catch(() => {
          commit('setErrorMsg', "There is a connection issue");
        });
    }
  },

  mutations: {

    // set request todo list type
    setTodoType(state, type) {
      state.todoType = type;
    },

    setFlag(state, todo) {
      todo.isFlagged = !(todo.isFlagged || todo.isFlagged === 1);
    },
    // set todoList from database to local state
    setTodoList(state, todoList) {
      state.todoList = todoList;
    },
    // set error message
    setErrorMsg(state, msg) {
      state.errorMsg = msg;
    },

    setTaskCompleted(state, task) {
      // boolean return 1 or true,  0 or false
      task.isCompleted = (!(task.isCompleted || task.isCompleted === 1));
    },

    setTodoPercentage(state, {
      todo,
      isCompleted
    }) {
      let dPercent = (1 / todo.task_num) * 100;
      // determine increasing or decreasing on percentage
      dPercent = (isCompleted) ? dPercent : -dPercent;
      todo.percentage += dPercent;
      if (todo.percentage > 100) {
        todo.percentage = 100;
      } else if (todo.percentage < 0) {
        todo.percentage = 0;
      }
    }
  },

  /**
   * get state information
   */
  getters: {
    // get todoList
    getTodoList(state) {
      return state.todoList;
    }
  }
};
