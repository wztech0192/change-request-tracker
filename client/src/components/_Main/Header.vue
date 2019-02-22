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
          <Nav-Menu :num="msgList.length" type="messages">
            <li v-for="msg in msgList">
              <!-- start message -->
              <a>
                <div class="pull-left">
                  <img src="@/assets/img/default.jpg" class="img-circle" alt="User Image">
                </div>
                <h4>
                  {{msg.sender}}
                  <small>
                    <i class="fa fa-clock-o"></i>
                    {{calculateTimePast(msg.sendTime)}}
                  </small>
                </h4>
                <p>{{msg.body}}</p>
              </a>
            </li>
          </Nav-Menu>

          <Nav-Menu
            :num="notifyList.new.length"
            type="notifications"
            footer="s"
            text="Last 30 Days"
          >
            <li style="box-shadow: inset 0px 10px 30px lightblue;">
              <label>
                <small>{{notifyList.new.length}} Unread Notification</small>
              </label>
              <span @click="clearNewNotification('all')" class="pull-right clickable archive">
                <i class="fa fa-archive"></i>
              </span>
            </li>

            <li v-for="notify in notifyList.new">
              <a @click="notifyDetail(notify)">
                <small class="pull-right">{{calculateTimePast(notify.created_at)}}</small>
                <i class="fa" :class="notify.icon"></i>
                {{notify.content}}
              </a>
            </li>

            <li style="box-shadow: inset 0px 10px 30px lightblue;">
              <label>
                <small>{{notifyList.old.length}} Read Notification</small>
              </label>
            </li>

            <li v-for="notify in notifyList.old">
              <a @click="notifyDetail(notify)">
                <small class="pull-right">{{calculateTimePast(notify.created_at)}}</small>
                <i class="fa" :class="notify.icon"></i>
                {{notify.content}}
              </a>
            </li>
          </Nav-Menu>

          <Nav-Menu :num="taskList.length" type="tasks">
            <li v-for="task in taskList">
              <!-- Task item -->
              <a>
                <h3>
                  <small class="pull-right">{{task.percentage}}%</small>
                  {{limitContentLength(task.content, 35)}}
                </h3>
                <div class="progress xs active">
                  <div
                    class="progress-bar progress-bar-striped"
                    :class="getProgressBarColor(task.percentage)"
                    :style="{width: task.percentage + '%' }"
                    role="progressbar"
                  >
                    <span class="sr-only">{{task.percentage}}% Complete</span>
                  </div>
                </div>
              </a>
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

export default {
  name: 'Header',
  components: {
    Logo,
    NavMenu
  },
  data: () => {
    return {
      //array of message for header menu
      msgList: [
        {
          avatar: 'adminLTE/dist/img/default.jpg',
          sender: 'Somebody',
          sendTime: '2019-01-21 05:52:23',
          body: 'Hey this is a testing67'
        },
        {
          avatar: 'adminLTE/dist/img/avatar2.jpg',
          sender: 'Somebody2',
          sendTime: '2019-01-29 05:52:23',
          body: 'Hey this is a testing3'
        },
        {
          avatar: 'adminLTE/dist/img/avatar04.jpg',
          sender: 'Somebody3',
          sendTime: '2019-02-22 03:21:12',
          body: 'Hey this is a testing2'
        }
      ]
    };
  },
  //data from parent
  props: {
    user: Object,
    taskList: Array,
    notifyList: Object,
    clearNewNotification: Function
  },
  methods: {
    //if has date and time, split date out and return it
    getDate: DateAndTime => {
      if (DateAndTime) {
        return DateAndTime.split(' ')[0];
      }
    },

    //calculate total time from send to now
    calculateTimePast(date) {
      //calculate duration
      var diff = new Date() - new Date(date);
      var time;
      if (diff > 86400000) {
        time = Math.round(diff / 86400000) + ' days';
      } else if (diff > 3600000) {
        time = Math.round(diff / 3600000) + ' hrs';
      } else {
        time = Math.round(diff / 60000) + ' min';
      }
      return time;
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
        var i = content.indexOf(' ', length - 5);
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
.notifications-menu small {
  font-size: 60%;
  color: gray;
  margin: -5px 0px 0px 10px;
}

.navbar .archive {
  transition: 0.3s ease;
  color: gray;
  margin: 5px 5px 0 10px;
}

.navbar .archive:hover {
  color: green;
}
</style>
