<!--
 - @author: Wei Zheng
 - @description: display change request detail
 -->

<template>
  <div v-if="requestData">
    <section class="content-header">
      <h1 style="padding:0; margin:0;">
        <a
          style="color:inherit;"
          @click="$router.push(previousRoute)"
          data-toggle="tooltip"
          data-placement="bottom"
          title="Go Back"
        >
          <i class="fa fa-reply"></i>
        </a>
        &nbsp;&nbsp;Change Request
        <span class="pull-right">
          <label
            class="label cr-status-trans clickable"
            :class="getStatusCSS('label',requestData.status)"
            data-toggle="tooltip"
            data-placement="left"
            :data-original-title="requestData.isFlag?'Un-Flag It':'Flag It'"
          >
            <transition name="slide-left" mode="out-in">
              <span v-if="!requestData.isFlag" @click="flagChangeRequest(true)" key="flag">
                {{requestData.status}}
                <i class="fa fa-flag-o"></i>
              </span>
              <span v-else @click="flagChangeRequest(false)" key="unflag">
                {{requestData.status}}
                <i class="fa fa-flag"></i>
              </span>
            </transition>
          </label>
        </span>
      </h1>
    </section>
    <section class="content">
      <div
        class="box form-background cr-status-trans"
        :class="getStatusCSS('box',requestData.status)"
      >
        <div class="box-body">
          <div>
            <span class="pull-right">
              <label>Post On:</label>
              {{requestData.created_at.split(" ")[0]}}
            </span>
            <span>
              <label>Client Name:</label>
              {{requestData.clientName}}
            </span>
          </div>
          <div>
            <span class="pull-right">
              <label>Update On:</label>
              {{requestData.updated_at.split(" ")[0]}}
            </span>
            <span>
              <label>Request ID:</label>
              {{requestData.id}}
            </span>
          </div>
          <br>
          <div>
            <label
              class="cr-status label clickable"
              :class="{'label-danger':requestData.status==='Cancelled'}"
              @click="changeStatus('Cancelled')"
              data-toggle="tooltip"
              data-placement="bottom"
              title="Cancelled"
            >CANCEL</label>
            
            <label
              class="cr-status label clickable"
              :class="{'label-warning':requestData.status==='To Do'}"
              @click="changeStatus('To Do')"
              data-toggle="tooltip"
              title="To Do"
              data-placement="bottom"
            >TO DO</label>
            
            <label
              class="cr-status label clickable"
              :class="{'label-primary':requestData.status==='In Progress'}"
              @click="changeStatus('In Progress')"
              data-toggle="tooltip"
              title="In Progress"
              data-placement="bottom"
            >In PROGRESS</label>
            
            <label
              class="cr-status label clickable"
              :class="{'label-success':requestData.status==='Complete'}"
              @click="changeStatus('Complete')"
              data-toggle="tooltip"
              title="Complete"
              data-placement="bottom"
            >COMPLETE</label>
          </div>
          <hr>
          <!-- Custom Tabs (Pulled to the right)  :class="{'active':todoType==='FLAG'}" -->
          <div class="nav-tabs-custom">
            <ul class="nav nav-tabs">
              <li class="cr-tab" :class="{'active':tab === 'content'}" @click="setTab('content')">
                <router-link :to="baseURL+'/content'">
                  <i class="fa fa-info-circle"></i> Content
                </router-link>
              </li>
              <li class="cr-tab" :class="{'active':tab === 'message'}" @click="setTab('message')">
                <router-link :to="baseURL+'/message'">
                  <i class="fa fa-comments"></i> Message
                </router-link>
              </li>
              <li class="cr-tab" :class="{'active':tab === 'history'}" @click="setTab('history')">
                <router-link :to="baseURL+'/history'">
                  <i class="fa fa-history"></i> History
                </router-link>
              </li>

              <!-- Add New ToDo Button
          <a
            class="pull-right btn btn-app addTodoBtn"
            @click="showPromptModal(false, 'Create New Todo')"
          >
            <i class="fa fa-calendar-plus-o"></i> New Todo
              </a>-->
            </ul>
            <div class="tab-content">
              <div class="tab-pane active">
                <!-- Nested Route -->
                <transition name="slide-right" mode="out-in">
                  <router-view
                    :user="user"
                    :requestData="requestData"
                    :refresh="refresh"
                    :calculateTimeElapsed="calculateTimeElapsed"
                  />
                </transition>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex';
import HTTP from '@/http';
import router from '@/router';
import helper from '@/mixin/helper.js';

export default {
  mixins: [helper],
  created() {
    this.fetchRequestData();
  },

  beforeRouteEnter(to, from, next) {
    //save previous route
    next(vm => {
      vm.previousRoute = from;
    });
  },

  computed: {
    ...mapState('userStore', ['user', 'refresh']),
    ...mapState('crStore', ['tab']),
    ...mapGetters('userStore', ['isAdmin']),

    baseURL() {
      return `/change-request/${this.$route.params.id}`;
    }
  },

  watch: {
    //update when refresh value change
    refresh() {
      this.fetchRequestData();
    }
  },

  data() {
    return {
      requestData: null,
      previousRoute: null
    };
  },

  methods: {
    ...mapActions('errorStore', ['setGlobalError']),
    ...mapMutations('crStore', ['setTab']),
    ...mapActions('userStore', ['fetchNavMenu']),

    //fetch request detail
    fetchRequestData() {
      return HTTP()
        .get(`/change-request/${this.$route.params.id}`)
        .then(({ data }) => {
          this.requestData = data;
        })
        .catch(e => {
          this.setGlobalError(e);
          router.push('/');
        });
    },

    //flag change request
    flagChangeRequest(isFlag) {
      this.requestData.isFlag = isFlag;
      if (isFlag) {
        return HTTP()
          .post(`/change-request/${this.requestData.id}/flag`, this.requestData)
          .then(({ data }) => {
            if (data === 'ok') {
              //refresh flag menu
              this.fetchNavMenu('flag');
            }
          })
          .catch(e => {
            this.setGlobalError(e);
          });
      } else {
        return HTTP()
          .delete(`/change-request/${this.requestData.id}/unflag`)
          .then(({ data }) => {
            if (data === 'ok') {
              //refresh flag menu
              this.fetchNavMenu('flag');
            }
          })
          .catch(e => {
            this.setGlobalError(e);
          });
      }
    },

    //change status, admin only
    changeStatus(status) {
      if (this.isAdmin) {
        //confirm modal to confirm the action
        this.$modal.show('dialog', {
          title: `<i class='fa fa-user-spinner'></i> Update Status`,
          maxWidth: 250,
          template: `<div style='text-align:center'><label>Current Status</label> : <label class="label ${this.getStatusCSS(
            'label',
            this.requestData.status
          )}">${
            this.requestData.status
          }</label><br><label>New Status</label> : <label  class="label ${this.getStatusCSS(
            'label',
            status
          )}">${status}</label></div>`,
          buttons: [
            {
              title: 'Confirm',
              default: true,
              handler: spinner => {
                spinner.loading = true;
                HTTP()
                  .patch(this.baseURL, { status })
                  .then(({ data }) => {
                    this.requestData.status = data.status;
                    this.$modal.hide('dialog');
                  })
                  .catch(e => {
                    //if fail, reset data
                    this.setGlobalError(e);
                    this.fetchRequestData();
                  })
                  .finally(() => {
                    spinner.loading = false;
                  });
              }
            },
            {
              title: 'Cancel'
            }
          ]
        });
      }
    }
  }
};
</script>

<style>
.cr-tab {
  width: 33%;
  text-align: center;
  margin-right: 0 !important;
  transition: 0.5s ease;
}
.cr-status {
  display: inline-block;
  box-shadow: 0px 2px 5px grey;
  width: 25%;
  color: transparent;
  border-radius: 0;
  transition: 0.3s ease;
  padding: 5px 0;
}

.cr-status-trans {
  transition: 0.3s ease;
}
</style>
