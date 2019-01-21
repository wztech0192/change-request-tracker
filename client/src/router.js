import Vue from 'vue';
import Router from 'vue-router';
import DevTodo from "./views/Dev/Todo.vue";
import Login from './components/Auth/Login.vue';
import Register from './components/Auth/Register.vue';

Vue.use(Router);

/* function AuthenicationRoute() {
  if(userNotLogedIn) {
    next('/login');
  }
} */

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: DevTodo
    },

    {
      path: '/login',
      component: Login
    },

    {
      path: '/register',
      component: Register
    },

    {
      path: '/about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component() {
        return import(/* webpackChunkName: "about" */ './views/About.vue');
      }
    }
  ]
});
