/**
 * @author Wei Zheng
 * @description store enter change request information, and change request filter tab
 */

import HTTP from '../http';

export default {
  namespaced: true,
  /**
   * state attribute
   */
  state: {
    requestData: {
      title: null,
      details: '',
      client: ''
    },
    error: {
      title_error: false,
      detail_error: false,
      client_error: false
    },
    listTab: 'active',
    // detail tab
    tab: 'content',

    ChangeRequestList: null
  },

  actions: {
    fetchChangeRequestList({ commit }, filter) {
      // select url based on user's role
      const url = this.getters['userStore/isAdmin']
        ? '/change-request/admin/list'
        : '/change-request/list';
      HTTP()
        .post(url, filter)
        .then(({ data }) => {
          commit('setCRList', data);
        })
        .catch((e) => {
          commit('setCRList', null);
          this.dispatch('errorStore/setGlobalError', e);
        });
    }
  },

  /**
   * Make changes to the state
   */
  mutations: {
    setCRList(state, list) {
      state.ChangeRequestList = list;
    },

    // set list tab to filter change request by status
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
        details: '',
        client: ''
      };
      state.error = {
        title_error: false,
        detail_error: false,
        client_error: false
      };
    }
  }
};
