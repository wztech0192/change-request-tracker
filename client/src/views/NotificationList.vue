<!--
 - @author: Wei Zheng
 - @description: display all notifications using server side process
 -->

<template>
  <div>
    <section class="content-header">
      <h1>
        <i class="fa fa-bell"></i>&nbsp;&nbsp;Notification History
      </h1>

      <div class="pull-right" style="margin-top:-30px">
        <div class="btn-group">
          <button type="button" class="btn btn-primary" @click="beforeOpenSelectedRow">
            <span class="not-mobile-ex">View &nbsp;</span>
            <i class="fa fa-eye"></i>
          </button>
          <button type="button" class="btn btn-secondary" @click="table.ajax.reload();">
            <i class="fa fa-refresh"></i>
          </button>
        </div>
      </div>
    </section>
    <section class="content">
      <div class="box">
        <div class="box-body">
          <table id="notify-table" class="table table-hover display" style="width:100%;">
            <thead></thead>
            <tbody></tbody>
          </table>
          <div v-if="loading" class="overlay">
            <i class="fa fa-spinner fa-spin"></i>
          </div>
        </div>
        <!-- /.box-body -->
      </div>
    </section>
    <!-- /.box -->
  </div>
</template>

<script>
import HTTP from '@/http';
import rowEvent from '@/mixin/rowEvent.js';
import sharedList from '@/mixin/sharedList.js';
import { mapActions } from 'vuex';

export default {
  mixins: [rowEvent, sharedList],

  watch: {
    notifyList(newData, oldData) {
      //update the table if the new data length if different than the old length
      if (
        newData &&
        oldData &&
        (oldData.old.length !== newData.old.length ||
          oldData.new.length !== newData.new.length)
      ) {
        this.table.ajax.reload();
      }
    }
  },

  mounted() {
    this.initiateTable();
  },

  methods: {
    ...mapActions('errorStore', ['setGlobalError']),

    //initialize data table
    initiateTable() {
      // base url for http request
      const baseURL = this.$store.getters.baseURL;
      // jwt token
      const header = {
        Authorization: `Bearer ${this.$store.state.userStore.token}`
      };
      const self = this;

      self.table = $('#notify-table')
        .on('processing.dt', function(e, settings, processing) {
          // loading icon
          self.loading = processing;
        })
        .DataTable({
          //resize based on widht
          responsive: true,
          //order by first col in ascending order
          order: [[2, 'desc']],
          iDisplayLength: 20,
          lengthMenu: [10, 20, 40, 60, 80, 100],
          deferRender: false,
          serverSide: true,
          data: [],
          columnDefs: [
            {
              targets: [0, 1],
              orderable: false
            }
          ],
          columns: [
            {
              data: 'icon',
              title: 'Icon',
              class: 'all text-center'
            },
            { data: 'isNew', title: '', class: 'all' },
            { data: 'created_at', title: 'Creation Date', class: 'all' },

            { data: 'content', title: 'Content', class: 'not-mobile' }
          ],
          searchDelay: 600,
          ajax: {
            type: 'POST',
            url: baseURL + '/util/notification/paginate',
            headers: header,

            dataSrc: ({ data }) => {
              return data;
            },

            error: (prop, type, error) => {
              self.setGlobalError(error);
            }
          },
          createdRow: function(row, data, dataIndex) {
            //bold id
            $(row)
              .find('td:eq(1)')
              .html(
                data.isNew === 1
                  ? '<label class="label bg-green">new</label>'
                  : ''
              );
            $(row)
              .find('td:eq(0)')
              .css('text-align', 'center')
              .html(`<i class='fa ${data.icon}'></i>`);
          },

          initComplete: function() {
            //click select event
            self.addRowSelectEvent('#notify-table', target => {
              const data = self.table.row($(target).index()).data();
              if (data) {
                self.notifyDetail(data);
              }
            });
          }
        });
    },

    //get selected row index and show dialog, alert when fail
    beforeOpenSelectedRow() {
      var notify = this.table.row($('#notify-table .selected').index()).data();
      //use open select row from selectRow event mixin
      this.openSelectedRow(this.notifyDetail, notify);
    }
  }
};
</script>

<style>
#notify-table .selected {
  background-color: lightgrey !important;
}
</style>
