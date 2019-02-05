import Vue from 'vue';
import Router from 'vue-router';
import DevTodo from "./views/Dev/Todo.vue";
import Login from './views/Auth/Login.vue';
import Register from './views/Auth/Register.vue';
import UserList from './views/Admin/UserList.vue';
import CreateRegisterCode from './views/Admin/CreateRegisterCode.vue';
import Dashboard from './views/Dashboard.vue';
import CRForm from './views/ChangeRequest/ChangeRequestForm.vue';
import CRList from "./views/ChangeRequest/ChangeRequestList.vue";
import store from './store/index';


Vue.use(Router);

// redirect if not logged in
function Authenication(to, from, next) {
  if (!store.getters['authentication/isLoggedIn']) {
    next('/login');
  } else next();
}

// reset token if user enter login/register page
function resetToken(to, from, next) {
  store.dispatch('authentication/logoutToken');
  next();
}

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [

    {
      path: '/login',
      component: Login,
      beforeEnter: resetToken
    },

    {
      path: '/register',
      component: Register,
      beforeEnter: resetToken
    },

    {
      path: '/',
      component: Dashboard,
      beforeEnter: Authenication
    },

    {
      path: '/dev/todo',
      component: DevTodo,
      beforeEnter: Authenication
    },

    {
      path: '/admin/user-list',
      component: UserList,
      beforeEnter: Authenication
    },

    {
      path: '/admin/generate-code',
      component: CreateRegisterCode,
      beforeEnter: Authenication
    },

    {
      path: '/change-request/form',
      component: CRForm,
      beforeEnter: Authenication
    },

    {
      path: '/change-request/list',
      component: CRList,
      beforeEnter: Authenication
    }
  ]
});
