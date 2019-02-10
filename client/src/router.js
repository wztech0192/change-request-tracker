import Vue from 'vue';
import Router from 'vue-router';
import DevTodo from "./views/Dev/Todo.vue";
import Login from './views/Auth/Login.vue';
import Register from './views/Auth/Register.vue';
import UserList from './views/Admin/UserList.vue';
import CreateRegisterCode from './views/Admin/CreateRegisterCode.vue';
import Dashboard from './views/Dashboard.vue';
import CREntry from './views/ChangeRequest/ChangeRequestEntry.vue';
import CRList from './views/ChangeRequest/ChangeRequestList.vue';
import CRDetail from './views/ChangeRequest/ChangeRequestDetail.vue';
import CRContent from './views/ChangeRequest/ChangeRequestDetail/_ChangeRequestContent.vue';
import CRMessage from './views/ChangeRequest/ChangeRequestDetail/_ChangeRequestMessage.vue';
import CRHistory from './views/ChangeRequest/ChangeRequestDetail/_ChangeRequestHistory.vue';
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
      path: '/change-request/entry',
      component: CREntry,
      beforeEnter: Authenication
    },

    {
      path: '/change-request',
      component: CRList,
      beforeEnter: Authenication
    },

    {
      path: '/change-request/:id',
      component: CRDetail,
      beforeEnter: Authenication,
      children: [
        {
          // render CRContent when /user/:id/content is matched
          path: 'content',
          component: CRContent
        },
        {
          // render CRMessage when /user/:id/message is matched
          path: 'message',
          component: CRMessage
        },
        {
          // rendered CRHistory when /user/:id/history is matched
          path: 'history',
          component: CRHistory
        }
      ]
    }
  ]
});
