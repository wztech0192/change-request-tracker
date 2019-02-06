<template>
  <div v-if="requestData">
    <section class="content-header">
      <h1 style="padding:0; margin:0;">
        <a
          style="color:inherit;"
          @click="$router.go(-1)"
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
      <div class="box form-background">
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
          <!-- Custom Tabs (Pulled to the right)  :class="{'active':todoType==='FLAG'}" -->
          <div class="nav-tabs-custom">
            <ul class="nav nav-tabs">
              <li class="cr-tab">
                <a data-toggle="tab" aria-expanded="false">
                  <i class="fa fa-history"></i> History
                </a>
              </li>
              <li class="cr-tab">
                <a data-toggle="tab" aria-expanded="false">
                  <i class="fa fa-comments"></i> Message
                </a>
              </li>
              <li class="active cr-tab">
                <a data-toggle="tab" aria-expanded="true">
                  <i class="fa fa-info-circle"></i> Detail
                </a>
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
                <ul>
                  <li>sadwadwa</li>
                  <li>sadwadwa</li>
                  <li>sadwadwa</li>
                  <li>sadwadwa</li>
                  <li>sadwadwa</li>
                  <li>sadwadwa</li>
                  <li>sadwadwa</li>
                  <li>sadwadwa</li>
                  <li>sadwadwa</li>
                  <li>sadwadwa</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import HTTP from "@/http";
import router from "@/router";

export default {
  created() {
    this.fetchRequestData();
  },

  computed: {
    ...mapState("authentication", ["user"])
  },

  data() {
    return {
      requestData: null
    };
  },

  methods: {
    ...mapActions("errorStore", ["setGlobalError"]),

    //fetch request detail
    fetchRequestData() {
      return HTTP()
        .get(`/change-request/${this.$route.params.id}`)
        .then(({ data }) => {
          console.log(data);
          this.requestData = data;
        })
        .catch(e => {
          this.setGlobalError(e);
          router.push("/");
        });
    }
  }
};
</script>

<style>
.cr-tab {
  width: 33%;
  text-align: center;
  margin-right:0 !important;
  transition:0.5s ease;
}
</style>
