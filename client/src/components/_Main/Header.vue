<template>
  <header class="main-header">
    <Logo style="transition:0.4s ease;"/>

    <!-- Header Navbar: style can be found in header.less -->
    <nav class="navbar navbar-static-top">
      <!-- Sidebar toggle button-->
      <a  class="sidebar-toggle" data-toggle="push-menu" role="button">
        <span class="sr-only">Toggle navigation</span>
      </a>

      <!-- Navbar Right Menu -->
      <div class="navbar-custom-menu">
        <ul class="nav navbar-nav">
          <!-- Messages: style can be found in dropdown.less-->
          <Nav-Menu :num="msgList.length" type="messages">
            <li v-for="msg in msgList">
              <!-- start message -->
              <a >
                <div class="pull-left">
                  <img src='@/assets/img/default.jpg' class="img-circle" alt="User Image">
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

          <Nav-Menu :num="noteList.length" type="notifications">
            <li v-for="note in noteList">
              <a >
                <i class="fa" :class="convertSignClass(note.sign)"></i>
                {{note.body}}
              </a>
            </li>
          </Nav-Menu>

          <Nav-Menu :num="taskList.length" type="tasks">
            <li v-for="task in taskList">
              <!-- Task item -->
              <a >
                <h3>
                  {{computeTaskContent(task.content)}}
                  <small class="pull-right">{{task.percentage}}%</small>
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
            <a  class="dropdown-toggle" data-toggle="dropdown">
              <img src="@/assets/img/default.jpg" class="user-image" alt="User Image">
              <span class="capitalize hidden-xs">{{user.first_name}} {{user.last_name}}</span>
            </a>
            <ul class="dropdown-menu">
              <!-- User image -->
              <li class="user-header">
                <img src="@/assets/img/default.jpg" class="img-circle" alt="User Image">

                <p class="capitalize">
                  {{user.first_name}} {{user.last_name}} - {{user.role}}
                  <small>Member since {{getDate(user.created_at)}}</small>
                </p>
              </li>
              <!-- Menu Body -->
              <li class="user-body">
                <div class="row">
                  <div class="col-xs-4 text-center">
                    <a >Button</a>
                  </div>
                  <div class="col-xs-4 text-center">
                    <a >Button</a>
                  </div>
                  <div class="col-xs-4 text-center">
                    <a >Button</a>
                  </div>
                </div>
                <!-- /.row -->
              </li>
              <!-- Menu Footer-->
              <li class="user-footer">
                <div class="pull-left">
                  <a  class="btn btn-default btn-flat">Profile</a>
                </div>
                <div class="pull-right">
                  <router-link to="/login" class="btn btn-default btn-flat">Sign out</router-link>
                </div>
              </li>
            </ul>
          </li>
          <!-- Control Sidebar Toggle Button -->
          <li>
            <a  data-toggle="control-sidebar">
              <i class="fa fa-gears"></i>
            </a>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script>
import Logo from "@/components/_Main/_Header/Logo.vue";
import NavMenu from "@/components/_Main/_Header/NavMenu.vue";

export default {
  name: "Header",
  components: {
    Logo,
    NavMenu
  },
  data: () => {
    return {
      //array of message for header menu
      msgList: [
        {
          avatar: "adminLTE/dist/img/default.jpg",
          sender: "Somebody",
          sendTime: 5,
          body: "Hey this is a testing67"
        },
        {
          avatar: "adminLTE/dist/img/avatar2.jpg",
          sender: "Somebody2",
          sendTime: 2,
          body: "Hey this is a testing3"
        },
        {
          avatar: "adminLTE/dist/img/avatar04.jpg",
          sender: "Somebody3",
          sendTime: 1,
          body: "Hey this is a testing2"
        }
      ],
      //array of alert for header menu
      noteList: [
        {
          body: "Hey this is a testing",
          sign: "alert"
        },
        {
          body: "Hey this is a testing3",
          sign: "info"
        },
        {
          body: "Hey this is a testing2",
          sign: "complete"
        },
        {
          body: "Hey this is a testing4",
          sign: "delete"
        }
      ],
    };
  },
  //data from parent
  props: {
    user: { type: Object, required: false, default: "Anonymous" },
    taskList:Array
  },
  methods: {
    //if has date and time, split date out and return it
    getDate: DateAndTime => {
      if (DateAndTime) {
        return DateAndTime.split(" ")[0];
      }
    },

    //calculate total time from send to now
    calculateTimePast: sendTime => {
      return sendTime + " mins";
    },

    //convert sign to fa fa class
    convertSignClass: sign => {
      switch (sign) {
        case "complete":
          return "fa-check-square text-green";
        case "alert":
          return "fa-warning text-yellow";
        case "info":
          return "fa-info-circle text-blue";
        case "delete":
          return "fa-check-square text-red";
      }
    },

    //define progress bar color based on its percentage
    getProgressBarColor: percent =>{
      if(percent<100){
        return "progress-bar-primary";
      }
      return "progress-bar-success";
    },

    // display maximum of 35 characters
    computeTaskContent(content){
      if(content.length>35){
        //split from the last empty space
        var i = content.indexOf(" ", 30);
        if (i<0) i=35;
        return content.substring(0,content.indexOf(" ", i)) +"..."
      }else{
        return content;
      }
    }
  }
};
</script>

<style>

.navbar a{
  transition:0.3s ease;
}
</style>
