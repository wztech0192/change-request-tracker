<template>
  <aside class="main-sidebar">
    <!-- sidebar: style can be found in sidebar.less -->
    <section class="sidebar">
      <!-- Sidebar user panel -->
      <div class="user-panel">
        <div class="pull-left image">
          <img src="/adminLTE/dist/img/avatar5.png" class="img-circle" alt="User Image">
        </div>
        <div class="pull-left info capitalize">
          <p>{{user.first_name}} {{user.last_name}}</p>

          <i class="fa fa-address-card capitalize"></i>
          &nbsp;&nbsp; {{user.role}}
        </div>
      </div>
      <!-- sidebar menu: : style can be found in sidebar.less -->
      <ul  class="sidebar-menu" data-widget="tree">
        <li v-for="item in navItem" :class="{'header':item.split}">

          <span v-if="item.split">{{item.split}}</span>
          <router-link v-else :to="item.link">
            <i :class="item.icon"></i> {{item.name}}
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
                <i class="fa fa-circle-o"></i> Simple tables
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
  name: "Sidebar",
  computed: {
    navItem: () => {
      return [
        {
          split: "Developer"
        },
        {
          link: "/devtodo",
          icon: "fa fa-code",
          name: "Todo List"
        },
        {
          split: "Admin"
        },
        {
          link: "/",
          icon: "fa fa-list",
          name: "Request Track"
        },
        {
          link: "/",
          icon: "fa fa-pie-chart",
          name: "Request Chart"
        },
        {
          link: "/user-list",
          icon: "fa fa-users",
          name: "Manage User"
        },
        {
          link: "/generate-code",
          icon: "fa fa-user-plus",
          name: "Register Code"
        },
        {
          split: "NAVIGATION"
        },
        {
          link: "/",
          icon: "fa fa-dashboard",
          name: "Dashboard"
        },
        {
          link: "/change-request/form",
          icon: "fa fa-edit",
          name: "Change Request"
        },
        {
          link: "/",
          icon: "fa fa-table",
          name: "Track Status"
        },
        {
          link: "/",
          icon: "fa fa-calendar",
          name: "Calendar"
        },
        {
          link: "/",
          icon: "fa fa-envelope",
          name: "Mailbox"
        }
      ];
    }
  },
  //data from parent
  props: {
    user: { type: Object, required: false, default: "Anonymous" }
  }
};
</script>

<style>
</style>
