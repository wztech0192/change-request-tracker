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
            <span class="mobile-hide">View &nbsp;</span>
            <i class="fa fa-eye"></i>
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
import { mapState, mapActions } from 'vuex';
import HTTP from '@/http';
import rowEvent from '@/mixin/rowEvent.js';

export default {
  mixins: [rowEvent],

  mounted() {
    this.initiateTable();
  },

  methods: {
    ...mapActions('errorStore', ['setGlobalError']),
    ...mapActions('userStore', ['clearNewNotification']),

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
            url: baseURL + '/user/notification/paginate',
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
              self.notifyDetail(self.table.row($(target).index()).data());
            });
          }
        });
    },

    //get selected row index and show dialog, alert when fail
    beforeOpenSelectedRow() {
      var notify = this.table.row($('#notify-table .selected').index()).data();
      //use open select row from selectRow event mixin
      this.openSelectedRow(this.notifyDetail, notify);
    },

    notifyDetail(notify) {
      if (notify.isNew) {
        // remove new status
        this.clearNewNotification(notify.id);
        $('#notify-table .selected')
          .find('td')
          .eq(1)
          .html('');
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
                  this.table.ajax.reload();
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
    }
  }
};
</script>

<style>
#notify-table .selected {
  background-color: lightgrey !important;
}
</style>