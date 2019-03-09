<template>
  <div v-if="notifyList && msgList && flagList">
    <section class="content-header">
      <h1>
        <i class="fa fa-dashboard"></i>
        &nbsp;&nbsp;Dash Board
      </h1>
      <ol class="breadcrumb">
        <li class="active">Last visit: {{user.updated_at}}</li>
      </ol>
    </section>
    <section class="content">
      <!-- ./box-body -->
      <div class="row">
        <!-- user block -->
        <div class="col-sm-3 col-xs-6">
          <div class="small-box bg-red">
            <div class="inner">
              <h3>{{user.total}}</h3>
              <p>Total User</p>
            </div>
            <div class="icon">
              <i class="fa fa-user"></i>
            </div>
            <router-link to="/change-request/entry" class="small-box-footer">
              Enter Request
              <i class="fa fa-arrow-circle-right"></i>
            </router-link>
          </div>
        </div>
        <!-- notification block -->
        <div class="col-sm-3 col-xs-6">
          <div class="small-box bg-yellow">
            <div class="inner">
              <h3>{{notifyList.totalNotifications}}</h3>

              <p>Total Notifications</p>
            </div>
            <div class="icon">
              <i class="fa fa-bell-o"></i>
            </div>
            <router-link to="/notifications" class="small-box-footer">
              View All
              <i class="fa fa-arrow-circle-right"></i>
            </router-link>
          </div>
        </div>

        <!-- flag block -->
        <div class="col-sm-3 col-xs-6">
          <div class="small-box bg-green">
            <div class="inner">
              <h3>{{flagList.totalCR}}</h3>
              <p>Total Requests</p>
            </div>
            <div class="icon">
              <i class="fa fa-exchange"></i>
            </div>
            <router-link
              :to="isAdmin?'/admin/change-request/':'/change-request/'"
              class="small-box-footer"
            >
              Track All
              <i class="fa fa-arrow-circle-right"></i>
            </router-link>
          </div>
        </div>

        <!-- message block -->
        <div class="col-sm-3 col-xs-6">
          <div class="small-box bg-aqua">
            <div class="inner">
              <h3>{{msgList.totalMsg}}</h3>

              <p>Total Messages</p>
            </div>
            <div class="icon">
              <i class="fa fa-bell-o"></i>
            </div>
            <router-link to="/mailbox" class="small-box-footer">
              Visit Mailbox
              <i class="fa fa-arrow-circle-right"></i>
            </router-link>
          </div>
        </div>

        <!-- /.row -->
      </div>
      <div class="row">
        <!-- Notification table -->
        <div class="col-md-6">
          <!-- /.box -->
          <div class="box box-warning">
            <div class="box-header with-border">
              <h3 class="box-title">Notifications Board</h3>
              <div class="box-tools">
                <router-link to="/notifications" class="btn btn-tool btn-sm text-black">
                  <i class="fa fa-bars"></i> View All
                </router-link>
              </div>
            </div>
            <div class="box-body dashbox" :class="{'dashbox-long':flagList.flagTask.length>0}">
              <table class="table">
                <thead>
                  <tr>
                    <th style="text-align:center;">
                      <i class="fa fa-info"></i>
                    </th>
                    <th style="text-align:center;">Content</th>
                    <th>Times</th>
                    <th>&nbsp;</th>
                  </tr>
                </thead>
                <tbody>
                  <!-- Unread New Notification -->
                  <tr>
                    <th v-if="notifyList.new.length>0" colspan="4" class="bg-success">
                      <label
                        class="label label-success"
                      >New Notifications: {{notifyList.new.length}}</label>
                    </th>
                  </tr>
                  <tr v-for="notify in notifyList.new" class="text-muted bg-success">
                    <td>
                      <i class="fa" :class="notify.icon"></i>
                    </td>
                    <td>{{notify.content}}</td>
                    <td
                      style="text-align:center;"
                    >{{calculateTimeElapsed(notify.created_at, [' mins',' hrs',' days'])}}</td>
                    <td style="text-align:right;">
                      <a @click="notifyDetail(notify)" class="text-muted">
                        <i class="fa fa-search"></i>
                      </a>
                    </td>
                  </tr>
                  <!-- Read Notification From Last 3 days-->
                  <tr>
                    <th colspan="4">
                      <label
                        class="label label-primary"
                      >{{notifyList.old.length}} Notifications From Last 3 Days</label>
                    </th>
                  </tr>
                  <tr v-for="notify in notifyList.old">
                    <td>
                      <i class="fa" :class="notify.icon"></i>
                    </td>
                    <td>{{notify.content}}</td>
                    <td style="white-space: nowrap;">
                      <i class="fa fa-clock-o"></i>
                      {{calculateTimeElapsed(notify.created_at, [' mins',' hrs',' days'])}}
                    </td>
                    <td style="text-align:right;">
                      <a @click="notifyDetail(notify)" class="text-muted">
                        <i class="fa fa-search"></i>
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <!-- /.box -->
        </div>
        <div class="col-md-6">
          <div class="box box-success">
            <div>
              <div class="box-header with-border">
                <h3 class="box-title">Flagged Change Requests</h3>
                <div class="box-tools">
                  <router-link
                    :to="isAdmin?'/admin/change-request/':'/change-request/'"
                    class="btn btn-tool btn-sm text-black"
                  >
                    <i class="fa fa-exchange"></i> View All
                  </router-link>
                </div>
              </div>
              <div class="box-body dashbox" :class="{'dashbox-long':flagList.flagTask.length <=0}">
                <!-- Flagged Change Request-->
                <table class="table table-striped table-bordered table-hover">
                  <thead>
                    <th style="padding-left:8px;">ID</th>
                    <th v-if="isAdmin" style="padding-left:8px;">Client</th>
                    <th style="padding-left:8px;">Status</th>
                    <th style="padding-left:8px;">Date</th>
                    <th style="padding-left:8px;">Title</th>
                  </thead>
                  <tbody>
                    <tr v-if="flagList.flagCR.length <=0">
                      <td
                        :colspan="isAdmin?5:4"
                        class="text-muted"
                        style="padding:80px 0;  font-size:24px; text-align:center;"
                      >Emtpy.....
                        <br>
                        <small
                          style="font-size:60%;"
                        >Flag a request on top-right corner of its detail page!</small>
                      </td>
                    </tr>
                    <tr v-else v-for="item in flagList.flagCR">
                      <td>
                        <router-link :to="`/change-request/${item.id}/content`">{{item.id}}</router-link>
                      </td>
                      <td v-if="isAdmin" style="white-space: nowrap;">{{item.clientName}}</td>
                      <td style="white-space: nowrap;">
                        <label
                          class="label"
                          :class="getStatusCSS('label',item.status)"
                        >{{item.status}}</label>
                      </td>

                      <td style="white-space: nowrap;">{{item.created_at.split('T')[0]}}</td>
                      <td style="white-space: nowrap;">{{limitContentLength(item.title,100)}}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div v-if="flagList.flagTask.length > 0" class="box box-success">
            <!-- flag table -->
            <div class="box-header with-border">
              <h3 class="box-title">Flagged Tasks</h3>
              <div class="box-tools">
                <router-link to="/notifications" class="btn btn-tool btn-sm text-black">
                  <i class="ion ion-clipboard"></i> Todo List
                </router-link>
              </div>
            </div>
            <div class="box-body dashbox box-success">
              <!-- Flagged Dev Task-->
              <ul class="list-group">
                <li class="list-group-item" v-for="item in flagList.flagTask">
                  <p>
                    <small class="pull-right" style="margin-left:2px;">{{item.percentage}}%</small>
                    {{item.content}}
                  </p>
                  <div class="progress xs active" style="margin-bottom:1px;">
                    <div
                      class="progress-bar progress-bar-striped"
                      :class="getProgressBarColor(item.percentage)"
                      :style="{width: item.percentage + '%' }"
                      role="progressbar"
                    >
                      <span class="sr-only">{{item.percentage}}% Complete</span>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- /.row -->
      <div class="row">
        <div class="col-md-12">
          <div class="box">
            <div class="box-header with-border">
              <h3 class="box-title">Messages</h3>

              <div class="box-tools pull-right">
                <router-link to="/mailbox" class="btn btn-tool btn-sm text-black">
                  <i class="fa fa-envelope"></i> Mailbox
                </router-link>
              </div>
            </div>
            <!-- /.box-header -->
            <div class="box-body" style="overflow:auto;">
              <table class="table table-hover table-striped">
                <thead>
                  <th>&nbsp;</th>
                  <th style="padding-left:8px;">Sender</th>
                  <th style="padding-left:8px;">Sender Email</th>

                  <th style="padding-left:8px;">Creation</th>
                  <th style="padding-left:8px; width:50%;">Subject</th>
                </thead>
                <tbody>
                  <tr>
                    <th colspan="5">
                      <label class="label label-success">New messages: {{msgList.unread.length}}</label>
                    </th>
                  </tr>
                  <tr v-for="msg in msgList.unread" @click="$modal.show('read-msg', msg)">
                    <td>
                      <Avator class="img-circle" :fullName="msg.senderName"/>
                    </td>

                    <td style="white-space: nowrap;">{{msg.senderName}}&nbsp;&nbsp;</td>
                    <td style="white-space: nowrap;">{{msg.senderEmail}}&nbsp;&nbsp;</td>
                    <td style="white-space: nowrap;">{{msg.created_at}}</td>
                    <td style="white-space: nowrap;">{{msg.title}}</td>
                  </tr>
                  <tr>
                    <th colspan="5" style="text-align:center;">
                      <label class="label label-warning pull-left">
                        <i class="fa fa-star"></i>
                        Bookmarked: {{msgList.bookmark.length}}
                      </label>
                    </th>
                  </tr>
                  <tr v-for="msg in msgList.bookmark" @click="$modal.show('read-msg', msg)">
                    <td>
                      <Avator class="img-circle" :fullName="msg.senderName"/>
                    </td>

                    <td style="white-space: nowrap;">{{msg.senderName}}&nbsp;&nbsp;</td>
                    <td style="white-space: nowrap;">{{msg.senderEmail}}&nbsp;&nbsp;</td>
                    <td style="white-space: nowrap;">{{msg.created_at}}</td>
                    <td style="white-space: nowrap;">{{msg.title}}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- /.box-footer -->
          </div>
          <!-- /.box -->
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import sharedList from '@/mixin/sharedList';
import Avator from '@/components/_Main/Avator';

export default {
  mixins: [sharedList],
  computed: {
    ...mapState('userStore', ['msgList', 'notifyList', 'flagList'])
  },
  components: {
    Avator
  }
};
</script>

<style>
.dashbox {
  overflow: auto;
  min-height: 283px;
  height: 283px;
}

@media (min-width: 992px) {
  .dashbox-long {
    height: auto;
    max-height: 630px;
  }
}
@media (max-width: 991px) {
  .dashbox {
    min-height: auto;
    height: auto;
    max-height: 400px;
  }
}
</style>
