import { sync } from 'vuex-router-sync';
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store/index';

Vue.config.productionTip = false;

sync(store, router);

new Vue({
  router,
  store,
  render(h) { return h(App); }
}).$mount('#app');
