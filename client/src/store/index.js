import createPersistedState from 'vuex-persistedstate';
import Vue from 'vue';
import Vuex from 'vuex';
import userStore from './userStore';
import errorStore from './errorStore';
import changeRequest from './changeRequest';

Vue.use(Vuex);

export default new Vuex.Store({
  strict: true,
  getters: {
    baseURL() {
      return '/api';
    }
  },
  modules: {
    userStore,
    errorStore,
    changeRequest
  },
  plugins: [createPersistedState()]
});
