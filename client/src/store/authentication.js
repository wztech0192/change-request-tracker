/**
 * @author Wei Zheng
 * @description store authentication detail. (e.g: jwt token, user information...)
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
    notifyList: [],
    registrationCode: null
  },

  /**
   * do action related to current state
   */
  actions: {
    // fetch user profile
    fetchUser({ commit }) {
      return (
        HTTP()
          .get('/user')
          // if user exist set user information in state, else set error message then redirect to login view
          .then(({ data }) => {
            if (data) {
              commit('setUser', data);
            } else {
              commit(
                'setExceptionError',
                'Cannot find the user. Try to Re-login.'
              );
              router.push('/login');
            }
          })
          .catch(() => {
            commit(
              'setExceptionError',
              'Cannot find the user. Try to Re-login.'
            );
            router.push('/login');
          })
      );
    },

    // get navigation menu list for current user by request
    // request type: notification, task, and message.
    fetchNavMenu({ commit }, request) {
      HTTP()
        .get(`/user/${request}`)
        .then(({ data }) => {
          console.log(data);
          commit(`${request}Commit`, data);
        })
        .catch(() => {
          commit('setExceptionError', 'Cannot find the user. Try to Re-login.');
          //    router.push('/login');
        });
    },

    clearNewNotification({ dispatch }, target) {
      HTTP()
        .get(`/user/notification/clear-new/${target}`)
        .then(() => {
          // refresh notification menu
          dispatch('fetchNavMenu', 'notification');
        })
        .catch((e) => {
          this.$store.dispatch('errorStore/setGlobalError', e);
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
    },

    // check if user is admin
    isAdmin(state) {
      return state.user.role === 'Developer' || state.user.role === 'Admin';
    },

    // check if user is developer
    isDev(state) {
      return state.user.role === 'Developer';
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
    taskCommit(state, taskList) {
      state.taskList = taskList;
    },

    // set user flagged list
    notificationCommit(state, notifyList) {
      console.log(notifyList);
      state.notifyList = notifyList;
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
