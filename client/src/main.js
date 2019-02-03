import { sync } from 'vuex-router-sync';
import VModal from 'vue-js-modal';

import Vue from 'vue';
import router from './router';
import store from './store/index';
import App from './App.vue';

require('../node_modules/bootstrap/dist/css/bootstrap.min.css');
require('../node_modules/font-awesome/css/font-awesome.min.css');
require('../node_modules/simple-line-icons/css/simple-line-icons.css');
require('../node_modules/bootstrap-switch/dist/css/bootstrap3/bootstrap-switch.min.css');

require('./assets/layout3/css/layout.min.css');
require('./assets/layout3/css/themes/default.min.css');
require('./assets/layout3/css/custom.css');
require('./assets/css/components.min.css');
require('./assets/css/plugins.min.css');

Vue.config.productionTip = false;
Vue.use(VModal, { dialog: true });

sync(store, router);

new Vue({
  router,
  store,
  render(h) { return h(App); }
}).$mount('#app');
