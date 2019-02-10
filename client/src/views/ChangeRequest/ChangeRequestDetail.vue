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
          <label class="label label-warning">{{requestData.status}}</label>
        </span>
      </h1>
    </section>
    <section class="content">
      <div class="box form-background" :class="'box'+getStatusLabel(requestData.status)">
        <div class="box-body">
          <div>
            <span class="pull-right">
              <label>Post On:</label>
              {{requestData.created_at.split(" ")[0]}}
            </span>
            <span>
              <label>Client Name:</label>
              {{requestData.client.first_name}} {{requestData.client.mid_initial}} {{requestData.client.last_name}}
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
          <div>
            <label
              class="cr-status label"
              :class="{'label-danger':requestData.status==='Canceled'}"
            >CANCEL</label>
            
            <label
              class="cr-status label"
              :class="{'label-warning':requestData.status==='To Do'}"
            >TO DO</label>
            
            <label
              class="cr-status label"
              :class="{'label-primary':requestData.status==='Progress'}"
            >PROGRESS</label>
            
            <label
              class="cr-status label"
              :class="{'label-success':requestData.status==='Completed'}"
            >COMPLETE</label>
          </div>
          <hr>
          <!-- Custom Tabs (Pulled to the right)  :class="{'active':todoType==='FLAG'}" -->
          <div class="nav-tabs-custom">
            <ul class="nav nav-tabs">
              <li class="cr-tab" :class="{'active':tab === 'content'}" @click="setTab('content')">
                <router-link :to="baseurl+'content'">
                  <i class="fa fa-info-circle"></i> Content
                </router-link>
              </li>
              <li class="cr-tab" :class="{'active':tab === 'message'}" @click="setTab('message')">
                <router-link :to="baseurl+'message'">
                  <i class="fa fa-comments"></i> Message
                </router-link>
              </li>
              <li class="cr-tab" :class="{'active':tab === 'history'}" @click="setTab('history')">
                <router-link :to="baseurl+'history'">
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
                  <router-view :user="user" :requestData="requestData"/>
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
import { mapState, mapActions, mapMutations } from "vuex";
import HTTP from "@/http";
import router from "@/router";

export default {
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
    ...mapState("authentication", ["user"]),
    ...mapState("changeRequest", ["tab"]),

    baseurl() {
      return `/change-request/${this.$route.params.id}/`;
    }
  },

  data() {
    return {
      requestData: null,
      previousRoute: null
    };
  },

  methods: {
    ...mapActions("errorStore", ["setGlobalError"]),
    ...mapMutations("changeRequest", ["setTab"]),

    //fetch request detail
    fetchRequestData() {
      return HTTP()
        .get(`/change-request/${this.$route.params.id}`)
        .then(({ data }) => {
          this.requestData = data;
        })
        .catch(e => {
          this.setGlobalError(e);
          router.push("/");
        });
    },

    //get statu colors class
    getStatusLabel(status) {
      {
        switch (status) {
          case "To Do":
            return "-warning";
          case "Process":
            return "-primary";
          case "Completed":
            return "-success";
          default:
            return "-danger";
        }
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
  padding: 5px 0;
}
</style>