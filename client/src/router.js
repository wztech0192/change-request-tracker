import Vue from 'vue';
import Router from 'vue-router';
import DevTodo from "./views/Dev/Todo.vue";
import Login from './views/Auth/Login.vue';
import Register from './views/Auth/Register.vue';
import UserManager from './views/UserManager.vue';
import store from './store/index';


Vue.use(Router);

// redirect if not logged in
function Authenication(to, from, next) {
  if (!store.getters['authentication/isLoggedIn']) {
    next('/login');
  } else next();
}

function resetToken(to, from, next) {
  store.dispatch('authentication/logoutToken');
  next();
}

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [{

    path: '/devtodo',
    component: DevTodo,
    beforeEnter: Authenication
  },

  {
    path: '/',
    component: UserManager,
    beforeEnter: Authenication
  },

  {
    path: '/login',
    component: Login,
    beforeEnter: resetToken
  },

  {
    path: '/register',
    component: Register,
    beforeEnter: resetToken
  }
  ]
});
