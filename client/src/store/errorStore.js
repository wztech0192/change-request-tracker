/**
 * Store error message
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
    setGlobalError({
      commit
    }, msg) {
      // set error message if msg is a string
      if (typeof msg === 'string') {
        commit('setGlobalError', msg);
      } else {
        try {
          const errorData = msg.response.data.error;
          if (typeof errorData === 'string') {
            commit('setGlobalError', errorData);
          } else {
            commit('setGlobalError', errorData.message);
            // if error is expired jwt token, redirect to login page
            if (errorData.name === "ExpiredJwtToken") {
              router.push("/login");
            }
          }
        } catch (e) {
          commit('setGlobalError', "Unknow Error Occurs");
        }
      }
    },

    clearGlobalError({
      commit
    }) {
      commit('clearGlobalError');
    }
  },

  getters: {
    getGlobalError(state) {
      return state.globalError;
    }
  }
};
