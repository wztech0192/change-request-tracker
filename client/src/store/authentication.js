/**
 * Store authenication details
 */

import HTTP from '../http';
import router from '../router';

export default {
  namespaced: true,
  /**
   * state attribute
   */
  state: {
    user: {
      email: null
    },
    ex_error: null,
    token: null,
    loading: false,
    taskList: [],
    registrationCode: null
  },

  /**
   * do action related to current state
   */
  actions: {

    // fetch user profile
    fetchUser({ commit }) {
      return HTTP().get('/user')
        // if user exist set user information in state, else set error message then redirect to login view
        .then(({ data }) => {
          if (data) {
            commit('setUser', data);
          } else {
            commit('setExceptionError', "Cannot find the user. Try to Re-login.");
            router.push('/login');
          }
        })
        .catch(() => {
          commit('setExceptionError', "Cannot find the user. Try to Re-login.");
          router.push('/login');
        });
    },

    // get user task list
    fetchTaskList({ commit }) {
      return HTTP().get('/user/task')
        .then(({ data }) => {
          if (data) {
            commit('setTaskList', data);
          } else {
            commit('setTaskList', []);
          }
        })
        .catch(() => {
          commit('setExceptionError', "Cannot find the user. Try to Re-login.");
          router.push('/login');
        });
    },

    // set exception error action
    setExceptionError({ commit }, string) {
      commit('setExceptionError', string);
    },

    // set token to null
    logoutToken({ commit }) {
      commit('setToken', null);
    }

  },

  /**
   * get state information
   */
  getters: {
    // check if user is logged in
    isLoggedIn(state) {
      //! return true when empty, another ! make it return false when empty
      return !!state.token;
    }
  },

  /**
   * Make changes to the state
   */
  mutations: {

    setRegistrationCode(state, code) {
      state.registrationCode = code;
    },

    // set user flagged list
    setTaskList(state, taskList) {
      state.taskList = taskList;
    },

    // login user information include token
    setUser(state, user) {
      state.user = user;
    },

    // set token after successfully login
    setToken(state, token) {
      state.token = token;
    },

    // toggle loading status
    setLoading(state, status) {
      state.loading = status;
    },

    // set exception errors
    setExceptionError(state, string) {
      state.user.password = null;
      state.ex_error = string;
    }

  }
};
