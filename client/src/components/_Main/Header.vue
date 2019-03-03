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
      <div class="navbar-custom-menu">
        <ul class="nav navbar-nav">
          <!-- Messages: style can be found in dropdown.less-->
          <Nav-Menu
            id="messages"
            :num="msgList.bookmark.length+msgList.unread.length"
            type="messages"
            footer="/mailbox"
          >
            <li class="nav-menu-break">
              <label>
                <small>{{msgList.unread.length}} New</small>
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
                  <img src="@/assets/img/default.jpg" class="img-circle" alt="User Image">
                </div>
                <h4>
                  {{msg.senderName}}
                  <small>
                    <i class="fa fa-clock-o"></i>
                    {{calculateTimeElapsed(msg.created_at,['m','h','d'])}}
                  </small>
                </h4>
                <p>{{msg.title}}</p>
              </a>
            </li>

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
              <a @click="$modal.show('read-msg', msg);">
                <div class="pull-left">
                  <img src="@/assets/img/default.jpg" class="img-circle" alt="User Image">
                </div>
                <h4>
                  {{msg.senderName}}
                  <small>
                    <i class="fa fa-clock-o"></i>
                    {{calculateTimeElapsed(msg.created_at,['m','h','d'])}}
                  </small>
                </h4>
                <p>{{msg.title}}</p>
              </a>
            </li>
          </Nav-Menu>

          <Nav-Menu
            id="notifications"
            :num="notifyList.new.length"
            type="notifications"
            footer="/notifications"
            text="Notifications"
          >
            <li class="nav-menu-break">
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

          <Nav-Menu
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
                <div class="progress xs active">
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
              <router-link :to="`/change-request/${item.id}/content`">
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
              <img src="@/assets/img/default.jpg" class="user-image" alt="User Image">
              <span class="capitalize hidden-xs">{{user.full_name}}</span>
            </a>
            <ul class="dropdown-menu">
              <!-- User image -->
              <li class="user-header">
                <img src="@/assets/img/default.jpg" class="img-circle" alt="User Image">

                <p class="capitalize">
                  {{user.full_name}} - {{user.role}}
                  <small>Member since {{getDate(user.created_at)}}</small>
                </p>
              </li>
              <!-- Menu Body -->
              <li class="user-body">
                <div class="row">
                  <div class="col-xs-4 text-center">
                    <a>Button</a>
                  </div>
                  <div class="col-xs-4 text-center">
                    <a>Button</a>
                  </div>
                  <div class="col-xs-4 text-center">
                    <a>Button</a>
                  </div>
                </div>
                <!-- /.row -->
              </li>
              <!-- Menu Footer-->
              <li class="user-footer">
                <div class="pull-left">
                  <a class="btn btn-default btn-flat">Profile</a>
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
import helper from '@/mixin/helper.js';

export default {
  mixins: [helper],
  name: 'Header',
  components: {
    Logo,
    NavMenu
  },

  watch: {
    flagList(newData, oldData) {
      if (
        oldData.flagCR.length !== newData.flagCR.length ||
        oldData.flagTask.length !== newData.flagTask.length
      ) {
        $('#task').effect('highlight', { color: '#00a65a' }, 1000);
      }
    },
    notifyList(newData, oldData) {
      if (
        oldData.old.length !== newData.old.length ||
        oldData.new.length !== newData.new.length
      ) {
        $('#notifications').effect('highlight', { color: '#f39c12' }, 1000);
      }
    },
    msgList(newData, oldData) {
      if (
        oldData.unread.length !== newData.unread.length ||
        oldData.bookmark.length !== newData.bookmark.length
      ) {
        $('#messages').effect('highlight', { color: '#3c8dbc' }, 1000);
      }
    }
  },

  //data from parent
  props: {
    user: Object,
    flagList: Object,
    notifyList: Object,
    msgList: Object,
    clearNewNotification: Function,
    clearNewMsg: Function
  },
  methods: {
    //if has date and time, split date out and return it
    getDate: DateAndTime => {
      if (DateAndTime) {
        return DateAndTime.split(' ')[0];
      }
    },

    notifyDetail(notify) {
      if (notify.isNew) {
        // remove new status
        this.clearNewNotification(notify.id);
      }
      //display notify detail modal
      this.$modal.show('dialog', {
        title:
          "<span class='text-blue'><i class='fa fa-info'></i> Notification</span>",
        template: `
        <label>Create Date</label>
        <p>${notify.created_at}</p>
        <label>Content</label>
        <p>${notify.content}</p>
        `,
        maxWidth: 300,
        buttons: notify.link
          ? [
              {
                title: 'Direct Me',
                handler: () => {
                  this.$router.push(notify.link);
                  this.$modal.hide('dialog');
                }
              },
              {
                title: 'Hide',
                default: true
              }
            ]
          : [
              {
                title: 'Ok',
                default: true
              }
            ]
      });
    },

    //define progress bar color based on its percentage
    getProgressBarColor: percent => {
      if (percent < 100) {
        return 'progress-bar-primary';
      }
      return 'progress-bar-success';
    },

    // display maximum of 35 characters
    limitContentLength(content, length) {
      if (content.length > length) {
        //split from the last empty space
        var i = content.indexOf(' ', length - 8);
        if (i < 0) i = length;
        return content.substring(0, content.indexOf(' ', i)) + '...';
      } else {
        return content;
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
.nav-menu-break small {
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
.navbar .nav-menu-break {
  box-shadow: inset 0px 10px 30px lightblue;
}
.navbar .new {
  box-shadow: inset -3px -3px 15px -2px lightblue;
}

.navbar-nav > .notifications-menu > .dropdown-menu,
.navbar-nav > .messages-menu > .dropdown-menu,
.navbar-nav > .tasks-menu > .dropdown-menu {
  width: 320px !important;
}
</style>
