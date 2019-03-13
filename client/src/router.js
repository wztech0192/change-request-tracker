import Vue from 'vue';
import Router from 'vue-router';
import DevTodo from './views/Dev/Todo.vue';
import DevTool from './views/Dev/Tool.vue';
import Login from './views/Auth/Login.vue';
import Register from './views/Auth/Register.vue';
import Contact from './views/Contact.vue';
import About from './views/About.vue';
import WebAPI from './views/Document/WebAPI.vue';
import PageRoute from './views/Document/PageRoute.vue';
import NotifyList from './views/NotificationList.vue';
import UserList from './views/Admin/UserList.vue';
import DataChart from './views/Admin/DataChart.vue';
import DataSearch from './views/Admin/DataSearch.vue';
import RegisterCodeForm from './views/Admin/RegisterCodeForm.vue';
import Dashboard from './views/Dashboard.vue';
import MailBox from './views/MailBox.vue';
import CREntry from './views/ChangeRequest/ChangeRequestEntry.vue';
import CRList from './views/ChangeRequest/ChangeRequestList.vue';
import CRDetail from './views/ChangeRequest/ChangeRequestDetail.vue';
import CRContent from './views/ChangeRequest/_ChangeRequestDetail/_ChangeRequestContent.vue';
import CRMessage from './views/ChangeRequest/_ChangeRequestDetail/_ChangeRequestMessage.vue';
import CRHistory from './views/ChangeRequest/_ChangeRequestDetail/_ChangeRequestHistory.vue';
import store from './store/index';

Vue.use(Router);

// verify if user is login and if user has right to enter the route.
function Authenication(to, from, next) {
  if (!store.getters['userStore/isLoggedIn']) {
    next('/login');
  } else {
    // check the path is admin only or developer only
    switch (to.fullPath.split('/')[1]) {
      case 'dev':
        // verify if user is dev, redirect if not
        if (store.getters['userStore/isDev']) {
          next();
        } else {
          store.commit(
            'errorStore/setGlobalError',
            'Only Developer are allow to enter this page'
          );
        }
        break;
      case 'admin':
        // verify if user is admin, redirect if not
        if (store.getters['userStore/isAdmin']) {
          next();
        } else {
          store.commit(
            'errorStore/setGlobalError',
            'Only Admin are allow to enter this page'
          );
        }
        break;
      default:
        next();
    }
  }
}

// reset token if user enter login/register page
function resetToken(to, from, next) {
  console.log('hi');
  store.dispatch('userStore/logoutClear');
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
      path: '/mailbox',
      component: MailBox,
      beforeEnter: Authenication
    },

    {
      path: '/notifications',
      component: NotifyList,
      beforeEnter: Authenication
    },

    {
      path: '/contact',
      component: Contact,
      beforeEnter: Authenication
    },
    {
      path: '/about',
      component: About,
      beforeEnter: Authenication
    },

    {
      path: '/document/web-api',
      component: WebAPI,
      beforeEnter: Authenication
    },

    {
      path: '/document/page-routes',
      component: PageRoute,
      beforeEnter: Authenication
    },

    {
      path: '/dev/todo',
      component: DevTodo,
      beforeEnter: Authenication
    },

    {
      path: '/dev/tool',
      component: DevTool,
      beforeEnter: Authenication
    },

    {
      path: '/admin/user-list',
      component: UserList,
      beforeEnter: Authenication
    },

    {
      path: '/admin/chart',
      component: DataChart,
      beforeEnter: Authenication
    },

    {
      path: '/admin/generate-code',
      component: RegisterCodeForm,
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
      path: '/admin/change-request/',
      component: CRList,
      beforeEnter: Authenication
    },

    {
      path: '/admin/change-request/search',
      component: DataSearch,
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
