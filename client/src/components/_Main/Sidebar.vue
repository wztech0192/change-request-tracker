<!--
 - @author: Wei Zheng
 - @description: navigation bar
 -->

<template>
  <aside class="main-sidebar" style="font-size : 13px;">
    <!-- sidebar: style can be found in sidebar.less -->
    <section class="sidebar">
      <!-- Sidebar user panel -->
      <div class="user-panel">
        <div class="pull-left image">
          <img src="@/assets/img/default.jpg" class="img-circle" alt="User Image">
        </div>
        <div class="pull-left info capitalize">
          <p>{{user.full_name}}</p>

          <i class="fa fa-address-card capitalize"></i>
          &nbsp; {{user.role}}
        </div>
      </div>
      <!-- sidebar menu: : style can be found in sidebar.less -->
      <ul class="sidebar-menu" data-widget="tree">
        <li v-for="item in navItem" :class="{'header':item.split}">
          <span v-if="item.split">{{item.split}}</span>
          <router-link v-else :to="item.link">
            <i :class="item.icon"></i>
            <span>{{item.name}}</span>
          </router-link>
        </li>

        <li class="treeview">
          <a href="#">
            <i class="fa fa-book"></i>
            <span>Document</span>
            <span class="pull-right-container">
              <i class="fa fa-angle-left pull-right"></i>
            </span>
          </a>
          <ul class="treeview-menu">
            <li>
              <a href="pages/tables/simple.html">
                <i class="fa fa-circle-o"></i>Simple tables
              </a>
            </li>
            <li>
              <a href="pages/tables/data.html">
                <i class="fa fa-circle-o"></i> Data tables
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </section>
  </aside>
</template>

<script>
export default {
  name: 'Sidebar',
  computed: {
    navItem: () => {
      return [
        {
          split: 'Developer'
        },
        {
          link: '/dev/todo',
          icon: 'fa fa-th',
          name: 'Todo List'
        },
        {
          link: '/dev/tool',
          icon: 'fa fa-wrench',
          name: 'Dev Tool'
        },
        {
          split: 'Admin'
        },
        {
          link: '/admin/change-request/',
          icon: 'fa fa-tasks',
          name: 'Manage Request'
        },
        {
          link: '/admin/change-request/search',
          icon: 'fa fa-search',
          name: 'Find Request'
        },
        {
          link: '/admin/chart',
          icon: 'fa fa-pie-chart',
          name: 'Data Chart'
        },
        {
          link: '/admin/user-list',
          icon: 'fa fa-users',
          name: 'Manage User'
        },
        {
          link: '/admin/generate-code',
          icon: 'fa fa-user-plus',
          name: 'Register Code'
        },
        {
          split: 'NAVIGATION'
        },
        {
          link: '/',
          icon: 'fa fa-dashboard',
          name: 'Dashboard'
        },
        {
          link: '/change-request/entry',
          icon: 'fa fa-edit',
          name: 'Enter Change Request'
        },
        {
          link: '/change-request',
          icon: 'fa fa-tasks',
          name: 'Track Request Status'
        },
        {
          link: '/mailbox',
          icon: 'fa fa-envelope',
          name: 'Mailbox'
        },
        {
          link: '/5',
          icon: 'fa fa-calendar',
          name: 'Calendar'
        }
      ];
    }
  },
  //data from parent
  props: {
    user: { type: Object, required: false, default: 'Anonymous' }
  },
  created() {
    $('.sidebar-menu li>a').click(() => {
      $('.selected').removeClass('selected');
      $(this).addClass('selected');
    });
  }
};
</script>

<style>
.sidebar-menu > li > a {
  transition: 0.2s ease;
}
.sidebar-menu li .router-link-exact-active {
  background: #ecf0f5 !important;
  color: black !important;
}

.sidebar-menu > li:hover > a > i {
  color: #00a2ff !important;
}
</style>
