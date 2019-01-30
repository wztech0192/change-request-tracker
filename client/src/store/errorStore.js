/**
 * Store error message
 */

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
      commit('setGlobalError', msg);
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
