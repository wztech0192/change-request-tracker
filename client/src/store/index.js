import createPersistedState from 'vuex-persistedstate';
import Vue from 'vue';
import Vuex from 'vuex';
import authentication from './authentication';
import errorStore from './errorStore';
import changeRequest from './change_request';

Vue.use(Vuex);

export default new Vuex.Store({
  strict: true,
  modules: {
    authentication,
    errorStore,
    changeRequest
  },
  plugins: [
    createPersistedState()
  ]
});
