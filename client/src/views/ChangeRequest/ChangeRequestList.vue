<!--
 - @author: Wei Zheng
 - @description: display change request list. Allow search and sort. 
 -               Two version, one for admin and one for client
 -->

<template>
  <div>
    <section class="content">
      <div class="nav-tabs-custom">
        <ul class="nav nav-tabs pull-right">
          <li class="dropdown" :class="isOtherTab()">
            <a class="dropdown-toggle" data-toggle="dropdown" aria-expanded="true">
              {{(listTab!=="all" && listTab!=="active")? listTab.toUpperCase(): "Status"}}
              <span
                class="caret"
              ></span>
            </a>
            <ul class="dropdown-menu">
              <li role="presentation">
                <a role="menuitem" tabindex="-1" @click="setListTab('Cancelled')">
                  <label class="label label-danger">Cancelled</label>
                </a>
              </li>
              <li role="presentation">
                <a role="menuitem" tabindex="-1" @click="setListTab('To Do')">
                  <label class="label label-warning">To Do</label>
                </a>
              </li>
              <li role="presentation">
                <a role="menuitem" tabindex="-1" @click="setListTab('In Progress')">
                  <label class="label label-primary">In Progress</label>
                </a>
              </li>
              <li role="presentation">
                <a role="menuitem" tabindex="-1" @click="setListTab('Complete')">
                  <label class="label label-success">Complete</label>
                </a>
              </li>
            </ul>
          </li>
          <li :class="isTab('all')" @click="setListTab('all')">
            <a to="all">All</a>
          </li>

          <li :class="isTab('active')" @click="setListTab('active')">
            <a to="active">Active</a>
          </li>

          <a
            class="pull-right btn btn-app addTodoBtn bg-blue"
            @click="$refs.table.beforeOpenSelectedRow()"
          >
            <i class="fa fa-eye"></i>Review
          </a>
          <li class="pull-left header">
            <h1 style="padding:0; margin:0; font-size:24px; ">
              <i class="fa fa-tasks"></i>
              &nbsp;&nbsp;{{isAdmin?'Change Request Manage':'My Change Request'}}
            </h1>
          </li>
        </ul>
        <div class="tab-content">
          <div class="tab-pane active">
            <div class="box">
              <div v-if="spinner.loading" class="overlay">
                <i class="fa fa-spinner fa-spin"></i>
              </div>
              <div class="box-body">
                <Datatable
                  ref="table"
                  :data="ChangeRequestList"
                  :filter="getTableFilter()"
                  :columns="getTableCol()"
                  :header="getTableHeader()"
                  :spinner="spinner"
                  :order="(isAdmin)?null:[3,'desc']"
                  :statusPos="(isAdmin)?null:1"
                />
              </div>
              <!-- /.box-body -->
            </div>
          </div>
          <!-- /.tab-pane -->
        </div>
        <!-- /.tab-content -->
      </div>
    </section>
    <!-- /.box -->
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions, mapMutations } from 'vuex';
import HTTP from '@/http';
import router from '@/router';
import Datatable from '@/components/ChangeRequestDatatable';

export default {
  components: {
    Datatable
  },

  data() {
    return {
      spinner: {
        loading: false
      }
    };
  },

  watch: {
    //fetch data when listTab changed
    listTab() {
      //display spinner when request start, hide spinner when table finish initializing
      this.spinner.loading = true;
      this.fetchChangeRequestList({ method: 'tab', tab: this.listTab });
    }
  },

  computed: {
    ...mapGetters('userStore', ['isAdmin']),
    ...mapState('crStore', ['listTab', 'tab', 'ChangeRequestList'])
  },

  created() {
    //display spinner when request start, hide spinner when table finish initializing
    this.spinner.loading = true;
    this.fetchChangeRequestList({ method: 'tab', tab: this.listTab });
  },

  methods: {
    ...mapActions('errorStore', ['setGlobalError']),
    ...mapMutations('crStore', ['setListTab']),
    ...mapActions('crStore', ['fetchChangeRequestList']),

    isTab(tab) {
      if (tab === this.listTab) {
        return 'active';
      }
    },

    isOtherTab() {
      if (this.listTab !== 'active' && this.listTab !== 'all') {
        return 'active';
      }
    },

    /* // fetch change request list, filter by tab
    fetchChangeRequestList() {
      //display spinner when request start, hide spinner when table finish initializing
      this.spinner.loading = true;

      let url = this.isAdmin
        ? '/change-request/admin/list'
        : '/change-request/list';
      HTTP()
        .post(url, { method: 'tab', tab: this.listTab })
        .then(({ data }) => {
          this.ChangeRequestList = data;
        })
        .catch(e => {
          this.setGlobalError(e);
        });
    },*/

    //get table header
    getTableHeader() {
      const head = [
        {
          class: 'all',
          text: 'ID'
        },
        {
          class: 'all',
          text: 'Status'
        },
        {
          class: 'all',
          text: 'Creation'
        },
        {
          class: 'desktop',
          text: 'Last Update'
        },
        {
          class: 'desktop',
          text: 'Messages'
        },
        {
          class: 'desktop',
          text: 'Hitories'
        },
        {
          class: 'none',
          text: 'Title'
        }
      ];

      //if is admin, display client name
      if (this.isAdmin) {
        head.splice(1, 0, {
          class: 'all',
          text: 'Client'
        });
        head[3].class = 'not-mobile';
      }

      return head;
    },

    getTableCol() {
      const col = [
        { data: 'id' },
        { data: 'status' },
        { data: 'created_at' },
        { data: 'updated_at' },
        { data: 'totalMessage' },
        { data: 'totalHistory' },
        { data: 'title' }
      ];

      //if is admin, display client name
      if (this.isAdmin) {
        col.splice(1, 0, { data: 'clientName' });
      }
      return col;
    },

    getTableFilter() {
      const filter = [0, 1, 2, 3, 4, 5];
      // filter clientname if is admin
      if (this.isAdmin) {
        filter.push(6);
      }
      return filter;
    }
  }
};
</script>

<style>
</style>
