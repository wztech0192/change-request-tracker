/**
 * @author Wei Zheng
 * @description store error message
 */

import router from '../router';

export default {
  namespaced: true,
  /**
   * state attribute
   */
  state: {
    // error message display on top of the screen
    globalError: null
  },
  mutations: {
    setGlobalError(state, msg) {
      state.globalError = msg;
    },

    clearGlobalError(state) {
      state.globalError = null;
    }
  },

  actions: {
    setGlobalError({ commit }, msg) {
      // set error message if msg is a string
      if (typeof msg === 'string') {
        commit('setGlobalError', msg);
      } else {
        try {
          const errorData = msg.response.data;
          if (errorData.message) {
            commit('setGlobalError', errorData.message);
          } else if (typeof errorData.error === 'string') {
            commit('setGlobalError', errorData.error);
          } else if (errorData.name === 'ExpiredJwtToken') {
            // if error is expired jwt token, redirect to login page
            commit(
              'setGlobalError',
              'Your session has expired. Please re-login.'
            );
            router.push('/login');
          } else {
            commit('setGlobalError', errorData.error.message);
          }
        } catch (e) {
          commit('setGlobalError', msg);
        }
      }
    },

    clearGlobalError({ commit }) {
      commit('clearGlobalError');
    }
  },

  getters: {
    getGlobalError(state) {
      return state.globalError;
    }
  }
};
