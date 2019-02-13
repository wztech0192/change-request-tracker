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
      details: "",
      client: ""
    },
    error: {
      title_error: false,
      detail_error: false,
      client_error: false
    },
    listTab: 'active',
    // detail tab
    tab: "content"
  },


  /**
   * Make changes to the state
   */
  mutations: {

    setListTab(state, tab) {
      state.listTab = tab;
    },

    // set detail tab
    setTab(state, tab) {
      state.tab = tab;
    },

    // set request title
    setTitle(state, el) {
      state.requestData.title = el.target.value;
    },

    // set message
    setMessage(state, message) {
      state.requestData.message = message;
    },

    // set message
    setClient(state, client) {
      state.requestData.client = client;
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
        details: "",
        client: ""
      };
      state.error = {
        title_error: false,
        detail_error: false,
        client_error: false
      };
    }

  }
};
