
<!--
 - @author: Wei Zheng
 - @description: allow admin to search change request based on change request id, 
 -              client name, created date range, and status.
 -->

<template>
  <div>
    <section class="content-header">
      <h1>
        <i class="fa fa-search"></i>&nbsp;&nbsp;Change Request Search
      </h1>
    </section>
    <section class="content">
      <form class="cr-search-form" @submit.prevent="beginSearch">
        <div class="box-body">
          <div class="row">
            <div class="col-md-6">
              <!-- Request ID -->
              <div class="form-group">
                <label>Change Reuqest ID:</label>

                <div class="input-group">
                  <div class="input-group-addon">
                    <i class="fa fa-tags"></i>
                  </div>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Change Reuqest ID"
                    v-model="filter.id"
                  >
                </div>
                <!-- /.input group -->
              </div>
            </div>
            <div class="col-md-6">
              <!-- Client  Name -->
              <div class="form-group">
                <label>Client Name:</label>

                <div class="input-group">
                  <div class="input-group-addon">
                    <i class="fa fa-user"></i>
                  </div>
                  <UserSearch
                    ref="usersearch"
                    searchRole="all"
                    :onChange="userChange"
                    :multiple="true"
                  />
                </div>
                <!-- /.input group -->
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6">
              <!-- Status -->
              <div class="form-group">
                <label>Request Status:</label>

                <div class="input-group">
                  <div class="input-group-addon">
                    <i class="fa fa-tasks"></i>
                  </div>
                  <select class="form-control" v-model="filter.status">
                    <option></option>
                    <option>Cancelled</option>
                    <option>To Do</option>
                    <option>In Progress</option>
                    <option>Complete</option>
                  </select>
                </div>
                <!-- /.input group -->
              </div>
              <!-- /.form group -->
            </div>
            <div class="col-md-6">
              <div class="form-group">
                <label>Created Date range:</label>

                <div class="input-group">
                  <div class="input-group-addon">
                    <i class="fa fa-calendar"></i>
                  </div>
                  <input
                    type="text"
                    placeholder="Select a Date Range"
                    class="form-control pull-right"
                    id="daterange"
                    autocomplete="off"
                  >
                </div>
                <!-- /.input group -->
              </div>
            </div>
          </div>

          <br>
          <div class="form-group" style="box-shadow: -1px 6px 8px grey;">
            <button class="btn btn-lg btn-primary" style="width:50%;">
              <i class="fa fa-search"></i> Search
            </button>
            <input type="reset" class="btn btn-lg btn-secondary" style="width:50%;" @click="clear">
          </div>
        </div>
        <!-- /.box-body -->
      </form>

      <div class="col-md-6 box box-primary">
        <div v-if="spinner.loading" class="overlay">
          <i class="fa fa-refresh fa-spin"></i>
        </div>
        <div class="box-body">
          <Datatable
            ref="table"
            :data="ChangeRequestList"
            :columns="columns"
            :header="header"
            :spinner="spinner"
            :dlength="10"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import HTTP from '@/http';
import router from '@/router';
import Datatable from '@/components/ChangeRequestDatatable';
import UserSearch from '@/components/UserSearch';

export default {
  components: {
    Datatable,
    UserSearch
  },

  data() {
    return {
      filter: {},
      ChangeRequestList: [],
      spinner: {
        loading: false
      },
      columns: [
        { data: 'id' },
        { data: 'clientName' },
        { data: 'status' },
        { data: 'created_at' }
      ],
      header: [
        {
          text: 'ID'
        },
        {
          text: 'Client'
        },
        {
          text: 'Status'
        },
        {
          text: 'Creation'
        }
      ]
    };
  },
  computed: {
    ...mapState('changeRequest', ['listTab', 'tab'])
  },

  mounted() {
    const self = this;
    //Date range picker
    $('#daterange').daterangepicker(
      {
        opens: 'left'
      },
      function(start, end) {
        self.filter.date =
          start.format('YYYY-MM-DD') + '/' + end.format('YYYY-MM-DD');
      }
    );
    // empty date by default
    $('#daterange').val('');
  },

  methods: {
    ...mapActions('errorStore', ['setGlobalError']),

    userChange(data) {
      this.filter.clientsName = data;
    },

    //clear all data
    clear() {
      this.ChangeRequestList = [];
      this.$refs.usersearch.clear();
      this.filter = {};
    },

    //begin searching
    beginSearch() {
      this.spinner.loading = true;
      return HTTP()
        .post('/change-request/admin/list', this.filter)
        .then(({ data }) => {
          this.ChangeRequestList = data;
        })
        .catch(e => {
          this.setGlobalError(e);
        });
    }
  }
};
</script>

<style>
.dataTable .dataTables_empty {
  min-height: 300px;
  font-size: 150%;
  padding: 10% 0;
}
</style>
