<template>
  <aside class="main-sidebar">
    <!-- sidebar: style can be found in sidebar.less -->
    <section class="sidebar">
      <!-- Sidebar user panel -->
      <div class="user-panel">
        <div class="pull-left image">
          <img src="/adminLTE/dist/img/avatar5.png" class="img-circle" alt="User Image">
        </div>
        <div class="pull-left info">
          <p>Wei Zheng</p>
         
           <i class="fa fa-address-card"></i>&nbsp;&nbsp; Developer
      
        </div>
      </div>
      <!-- sidebar menu: : style can be found in sidebar.less -->
      <ul class="sidebar-menu" data-widget="tree">
        <!-- Admin Tab -->
        <li class="header">Developer</li>
        <li>
          <a href="#">
            <i class="fa fa-code"></i>
            <span>Todo List</span>
          </a>
        </li>
        <!-- Admin Tab -->
        <li class="header">ADMINISTRATOR</li>

        <li class="treeview">
          <a href="#">
            <i class="fa fa-list"></i>
            <span>Request List</span>
            <span class="pull-right-container">
              <i class="fa fa-angle-left pull-right"></i>
            </span>
          </a>
          <ul class="treeview-menu">
            <li>
              <a href="pages/tables/simple.html">
                <i class="fa fa-circle-o"></i>All
              </a>
            </li>
            <li>
              <a href="pages/tables/data.html">
                <i class="fa fa-exclamation-circle"></i>To-Do
              </a>
            </li>
            <li>
              <a href="pages/tables/simple.html">
                <i class="fa fa-spinner"></i>In Progress
              </a>
            </li>
            <li>
              <a href="pages/tables/simple.html">
                <i class="fa fa-check-circle"></i>Complete
              </a>
            </li>
          </ul>
        </li>
        <li>
          <a href="#">
            <i class="fa fa-users"></i>
            <span>Create User</span>
          </a>
        </li>
        <li>
          <a href="#">
            <i class="fa fa-pie-chart"></i>
            <span>Charts</span>
          </a>
        </li>

        <li class="header">MAIN NAVIGATION</li>
        <li>
          <a href="pages/widgets.html">
            <i class="fa fa-dashboard"></i>
            <span>Dashboard</span>
          </a>
        </li>
        <li class="treeview">
          <a href="#">
            <i class="fa fa-edit"></i>
            <span>Forms</span>
            <span class="pull-right-container">
              <i class="fa fa-angle-left pull-right"></i>
            </span>
          </a>
          <ul class="treeview-menu">
            <li>
              <a href="pages/forms/general.html">
                <i class="fa fa-circle-o"></i> General Elements
              </a>
            </li>
            <li>
              <a href="pages/forms/advanced.html">
                <i class="fa fa-circle-o"></i> Advanced Elements
              </a>
            </li>
            <li>
              <a href="pages/forms/editors.html">
                <i class="fa fa-circle-o"></i> Editors
              </a>
            </li>
          </ul>
        </li>
        <li class="treeview">
          <a href="#">
            <i class="fa fa-table"></i>
            <span>Tables</span>
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
        <li>
          <a href="pages/calendar.html">
            <i class="fa fa-calendar"></i>
            <span>Calendar</span>
          </a>
        </li>
        <li>
          <a href="pages/mailbox/mailbox.html">
            <i class="fa fa-envelope"></i>
            <span>Mailbox</span>
          </a>
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
  name: "Sidebar"
};
</script>

<style>
</style>
