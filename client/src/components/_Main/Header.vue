<template>
  <header class="main-header">
    <Logo style="transition:0.4s ease;"/>

    <!-- Header Navbar: style can be found in header.less -->
    <nav class="navbar navbar-static-top">
      <!-- Sidebar toggle button-->
      <a class="sidebar-toggle" data-toggle="push-menu" role="button">
        <span class="sr-only">Toggle navigation</span>
      </a>

      <!-- Navbar Right Menu -->
      <!-- message menu -->
      <div class="navbar-custom-menu">
        <ul class="nav navbar-nav">
          <!-- Messages: style can be found in dropdown.less-->
          <Nav-Menu
            v-if="msgList"
            id="messages"
            :num="msgList.bookmark.length+msgList.unread.length"
            type="messages"
            footer="/mailbox"
          >
            <!-- new message -->
            <li class="nav-menu-break-new">
              <label>
                <small>New: {{msgList.unread.length}}</small>
              </label>
              <label class="pull-right">
                <small @click="clearNewMsg" class="clickable dismiss">
                  <i class="fa fa-trash"></i> dismiss
                </small>
              </label>
            </li>

            <li v-for="msg in msgList.unread" class="new">
              <!-- start message -->
              <a @click="$modal.show('read-msg', msg);">
                <div class="pull-left">
                  <Avator class="img-circle" :fullName="msg.senderName"/>
                </div>
                <h4>
                  {{msg.senderName}}
                  <small>
                    <i class="fa fa-clock-o"></i>
                    {{calculateTimeElapsed(msg.created_at,['m','h','d'])}}
                  </small>
                </h4>
                <p>{{limitContentLength(msg.title, 45)}}</p>
              </a>
            </li>

            <!--bookmarked message menu -->
            <li class="nav-menu-break">
              <label>
                <small>
                  <i class="fa fa-star text-yellow"></i>
                  Bookmark: {{msgList.bookmark.length}}
                </small>
              </label>
            </li>

            <li v-for="msg in msgList.bookmark">
              <!-- start message -->
              <a @click="$modal.show('read-msg', msg) ">
                <div class="pull-left">
                  <Avator class="img-circle" :fullName="msg.senderName"/>
                </div>
                <h4>
                  {{msg.senderName}}
                  <small>
                    <i class="fa fa-clock-o"></i>
                    {{calculateTimeElapsed(msg.created_at,['m','h','d'])}}
                  </small>
                </h4>
                <p>{{limitContentLength(msg.title, 45)}}</p>
              </a>
            </li>
          </Nav-Menu>

          <!-- notifications menu -->
          <Nav-Menu
            v-if="notifyList"
            id="notifications"
            :num="notifyList.new.length"
            type="notifications"
            footer="/notifications"
            text="Notifications"
          >
            <!-- unread notification -->
            <li class="nav-menu-break-new">
              <label>
                <small>Unread: {{notifyList.new.length}}</small>
              </label>
              <label class="pull-right">
                <small @click="clearNewNotification('all')" class="clickable dismiss">
                  <i class="fa fa-trash"></i> dismiss
                </small>
              </label>
            </li>

            <li v-for="notify in notifyList.new" class="new">
              <a @click="notifyDetail(notify)">
                <small class="pull-right">
                  <i class="fa fa-clock-o"></i>
                  {{calculateTimeElapsed(notify.created_at, ['m','h','d'])}}
                </small>
                <i class="fa" :class="notify.icon"></i>
                {{notify.content}}
              </a>
            </li>
            <!-- read notification  -->
            <li class="nav-menu-break">
              <label>
                <small>Read (Last 3 Days) :{{notifyList.old.length}}</small>
              </label>
            </li>

            <li v-for="notify in notifyList.old">
              <a @click="notifyDetail(notify)">
                <small class="pull-right">
                  <i class="fa fa-clock-o"></i>
                  {{calculateTimeElapsed(notify.created_at,['m','h','d'])}}
                </small>
                <i class="fa" :class="notify.icon"></i>
                {{notify.content}}
              </a>
            </li>
          </Nav-Menu>
          <!-- flag menu -->
          <Nav-Menu
            v-if="flagList"
            id="task"
            :num="flagList.length"
            type="tasks"
            :text="`You have ${flagList.length} flagged items`"
          >
            <li v-if="flagList.flagTask.length>0" class="nav-menu-break">
              <label>
                <small>Tasks: {{flagList.flagTask.length}}</small>
              </label>
            </li>
            <!-- Flagged Dev Task-->
            <li v-for="item in flagList.flagTask">
              <router-link to="/dev/todo">
                <h3>
                  <small class="pull-right">{{item.percentage}}%</small>
                  {{limitContentLength(item.content, 40)}}
                </h3>
                <div class="progress xs">
                  <div
                    class="progress-bar progress-bar-striped"
                    :class="getProgressBarColor(item.percentage)"
                    :style="{width: item.percentage + '%' }"
                    role="progressbar"
                  >
                    <span class="sr-only">{{item.percentage}}% Complete</span>
                  </div>
                </div>
              </router-link>
            </li>

            <!-- Flagged Change Request-->
            <li v-if="flagList.flagCR.length>0" class="nav-menu-break">
              <label>
                <small>Change Request: {{flagList.flagCR.length}}</small>
              </label>
            </li>

            <li v-for="item in flagList.flagCR">
              <!-- item is a change reuqest if request id is greater than 0-->
              <router-link :to="`/change-request/${item.id}/content`" :title="'ID: '+item.id">
                <small class="pull-right">
                  <label class="label" :class="getStatusCSS('label',item.status)">{{item.status}}</label>
                </small>
                <h3>{{limitContentLength(item.title, 35)}}</h3>
              </router-link>
            </li>
          </Nav-Menu>
          <!-- User Account: style can be found in dropdown.less -->
          <li class="dropdown user user-menu">
            <a class="dropdown-toggle" data-toggle="dropdown">
              <Avator class="user-image" :fn="user.first_name" :ln="user.last_name"/>

              <span class="capitalize hidden-xs">{{user.full_name}}</span>
            </a>
            <ul class="dropdown-menu">
              <!-- User image -->
              <li class="user-header">
                <Avator class="img-circle" :fn="user.first_name" :ln="user.last_name"/>
                <p>
                  {{user.full_name}} - {{user.role}}
                  <small>Member since {{getDate(user.created_at)}}</small>
                  <small>Last visit {{getDate(user.updated_at)}}</small>
                </p>
              </li>
              <!-- Menu Body -->
              <!-- Menu Footer-->
              <li class="user-footer">
                <div class="pull-left">
                  <a
                    class="btn btn-default btn-flat"
                    @click="$modal.show('user-modal',user.email)"
                  >Profile</a>
                </div>
                <div class="pull-right">
                  <router-link to="/login" class="btn btn-default btn-flat">Sign out</router-link>
                </div>
              </li>
            </ul>
          </li>
          <!-- Control Sidebar Toggle Button -->
          <li>
            <a data-toggle="control-sidebar">
              <i class="fa fa-gears"></i>
            </a>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script>
import Logo from '@/components/_Main/_Header/Logo.vue';
import NavMenu from '@/components/_Main/_Header/NavMenu.vue';
import sharedList from '@/mixin/sharedList.js';
import Avator from '@/components/_Main/Avator';

export default {
  mixins: [sharedList],
  name: 'Header',
  components: {
    Logo,
    NavMenu,
    Avator
  },

  // change changes, highligh when there is change made in length
  watch: {
    flagList(newData, oldData) {
      if (
        newData &&
        oldData &&
        (oldData.flagCR.length !== newData.flagCR.length ||
          oldData.flagTask.length !== newData.flagTask.length)
      ) {
        $('#task').effect('highlight', { color: '#00a65a' }, 1000);
      }
    },
    notifyList(newData, oldData) {
      if (
        newData &&
        oldData &&
        (oldData.old.length !== newData.old.length ||
          oldData.new.length !== newData.new.length)
      ) {
        $('#notifications').effect('highlight', { color: '#f39c12' }, 1000);
      }
    },
    msgList(newData, oldData) {
      if (
        newData &&
        oldData &&
        (oldData.unread.length !== newData.unread.length ||
          oldData.bookmark.length !== newData.bookmark.length)
      ) {
        $('#messages').effect('highlight', { color: '#3c8dbc' }, 1000);
      }
    }
  }
};
</script>

<style>
.navbar a {
  transition: 0.3s ease;
}
.notifications-menu small,
.nav-menu-break small,
.nav-menu-break-new small {
  font-size: 70%;
  color: gray;
  margin: -5px 0px 0px 10px;
}
.navbar .dismiss {
  transition: 0.3s ease;
  color: gray;
  margin: 5px 5px 0 10px;
}

.navbar .dismiss:hover {
  color: green;
}
.navbar .nav-menu-break-new {
  box-shadow: inset 0px 10px 30px lightgreen;
}
.navbar .nav-menu-break {
  box-shadow: inset 0px 10px 30px lightblue;
}
.navbar .new {
  box-shadow: inset -3px -3px 10px -4px lightgreen;
}

.navbar-nav > .notifications-menu > .dropdown-menu,
.navbar-nav > .messages-menu > .dropdown-menu,
.navbar-nav > .tasks-menu > .dropdown-menu {
  width: 320px !important;
}
</style>
