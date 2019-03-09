/* Bootstrap 3.3.7 */
import './assets/adminlte/bower_components/bootstrap/dist/css/bootstrap.min.css';
/* Font Awesome */
import './assets/adminlte/bower_components/font-awesome/css/font-awesome.min.css';
/* Ionicons */
import './assets/adminlte/bower_components/Ionicons/css/ionicons.min.css';
/* Theme style */
import './assets/adminlte/dist/css/AdminLTE.min.css';
/* Select2 */
import './assets/adminlte/bower_components/select2/dist/css/select2.min.css';
import './assets/adminlte/bower_components/select2/dist/css/select2-bootstrap.min.css';
/* ICheck */
import './assets/adminlte/plugins/iCheck/flat/blue.css';
/* daterange picker */
import './assets/adminlte/bower_components/bootstrap-daterangepicker/daterangepicker.css';
/* AdminLTE Skins. Choose a skin from the css/skins
       folder instead of downloading all of them to reduce the load. */
import './assets/adminlte/dist/css/skins/_all-skins.min.css';
/* DataTables */
import './assets/adminlte/bower_components/datatables.net/css/jquery.dataTables.min.css';
import './assets/adminlte/bower_components/datatables.net/css/rowReorder.dataTables.min.css';
import './assets/adminlte/bower_components/datatables.net/css/responsive.dataTables.min.css';
/* Date Picker */
import './assets/adminlte/bower_components/bootstrap-datepicker/dist/css/bootstrap-datepicker.min.css';
/* Pace style */
import './assets/adminlte/plugins/pace/pace.min.css';

/* Float square animation */
import './assets/css/float-square.css';

/* rotate cricle animation */
import './assets/css/rotate-circle.css';

/* HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries */
/* WARNING: Respond.js doesn't work if you view the page via file:// */
/* [if lt IE 9]>
  import "./assetshttps://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min"</script>
  import "./assetshttps://oss.maxcdn.com/respond/1.4.2/respond.min"</script>
  <![endif] */

/* Google Font */
import './assets/adminlte/font.css';
/* jQuery 3 */
import './assets/adminlte/bower_components/jquery/dist/jquery.min';
/* jQuery UI 1.11.4 */
import './assets/adminlte/bower_components/jquery-ui/jquery-ui.min';
/* Bootstrap 3.3.7 */
import './assets/adminlte/bower_components/bootstrap/dist/js/bootstrap.min';

/* Sparkline */
import './assets/adminlte/bower_components/jquery-sparkline/dist/jquery.sparkline.min';
/* Select2 */
import './assets/adminlte/bower_components/select2/dist/js/select2.full.min';
/* DataTables */
import './assets/adminlte/bower_components/datatables.net-bs/js/dataTables.bootstrap.min';
import './assets/adminlte/bower_components/datatables.net/js/jquery.dataTables.min';
import './assets/adminlte/bower_components/datatables.net/js/dataTables.rowReorder.min';
import './assets/adminlte/bower_components/datatables.net/js/dataTables.responsive.min';
/* Slimscroll */
import './assets/adminlte/bower_components/jquery-slimscroll/jquery.slimscroll.min';
/* FastClick */
import './assets/adminlte/bower_components/fastclick/lib/fastclick';
/* ICheck */
import './assets/adminlte/plugins/iCheck/icheck.min';
/* date - range - picker */
import './assets/adminlte/bower_components/bootstrap-daterangepicker/daterangepicker';
/* AdminLTE App */
import './assets/adminlte/dist/js/adminlte.min';
/* PACE */
import './assets/adminlte/bower_components/PACE/pace.min';
/* datepicker */
import './assets/adminlte/bower_components/bootstrap-datepicker/dist/js/bootstrap-datepicker.min';

/* AdminLTE for themeSetting */
import './assets/adminlte/dist/js/themeSetting';

/* CK Editor */
import { sync } from 'vuex-router-sync';
import VModal from 'vue-js-modal';

import Vue from 'vue';

import router from './router';
import store from './store/index';
import App from './App.vue';

window.ClassicEditor = require('./assets/adminlte/bower_components/ckeditor5-build-classic/ckeditor');
window.Chart = require('./assets/adminlte/bower_components/chart.js/Chart.min');

Vue.config.productionTip = false;
Vue.use(VModal, { dialog: true });

sync(store, router);

new Vue({
  router,
  store,
  render(h) {
    return h(App);
  }
}).$mount('#app');
