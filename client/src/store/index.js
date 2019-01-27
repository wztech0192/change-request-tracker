import createPersistedState from 'vuex-persistedstate';
import Vue from 'vue';
import Vuex from 'vuex';
import authentication from './authentication';
import devTodo from './devTodo';

Vue.use(Vuex);

export default new Vuex.Store({
  strict: true,
  modules: {
    authentication,
    devTodo
  },
  mutations: {

  },
  actions: {

  },
  plugins: [
    createPersistedState()
  ]
});
