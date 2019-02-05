/**
 * Store change_request details
 */


export default {
  namespaced: true,
  /**
   * state attribute
   */
  state: {
    requestData: {
      title: null,
      details: ""
    },
    error: {
      title_error: false,
      detail_error: false
    }
  },


  /**
   * Make changes to the state
   */
  mutations: {

    // set request title
    setTitle(state, el) {
      state.requestData.title = el.target.value;
    },

    // set message
    setMessage(state, message) {
      state.requestData.message = message;
    },

    // set request detail
    setDetail(state, detail) {
      state.requestData.details = detail;
    },

    // set error msg
    setError(state, target) {
      state.error[`${target}_error`] = true;
    },

    // clear error
    clearError(state, target) {
      state.error[`${target}_error`] = false;
    },

    // clear all
    clearAll(state) {
      state.requestData = {
        title: null,
        details: ""
      };
      state.error = {
        title_error: false,
        detail_error: false
      };
    }

  }
};
