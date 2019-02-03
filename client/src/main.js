import { sync } from 'vuex-router-sync';
import VModal from 'vue-js-modal';

import Vue from 'vue';
import router from './router';
import store from './store/index';
import App from './App.vue';


Vue.config.productionTip = false;
Vue.use(VModal, { dialog: true });

sync(store, router);

new Vue({
  router,
  store,
  render(h) { return h(App); }
}).$mount('#app');
