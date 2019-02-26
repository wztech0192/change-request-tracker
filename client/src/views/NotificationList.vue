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
          <button type="button" class="btn btn-primary" @click="openSelectedRow">
            <span class="mobile-hide">View &nbsp;</span>
            <i class="fa fa-edit"></i>
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
            <i class="fa fa-refresh fa-spin"></i>
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

export default {
  data() {
    return {
      loading: false,
      table: null
    };
  },

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
            $('#notify-table tbody').on('click', 'tr', function() {
              self.addTableSelect(this);
            });

            //double click event
            $('#notify-table tbody').on('dblclick', 'tr', function() {
              if (!$(this).hasClass('child')) {
                self.notifyDetail(self.table.row($(this).index()).data());
              }
            });

            var touched = false;
            //double tab event
            $('#notify-table tbody').on('touchstart', 'tr', function(e) {
              if (!$(this).hasClass('child')) {
                self.addTableSelect(this);
                if (!touched) {
                  touched = true;
                  setTimeout(() => {
                    touched = false;
                  }, 200);
                } else {
                  self.notifyDetail(self.table.row($(this).index()).data());
                }
              }
            });
            //top touch count down
            $('#change-request-table tbody').on('touchend', 'tr', function() {
              clearTimeout(touched);
            });
          }
        });
    },

    //focus and select table row
    addTableSelect(tr) {
      if (!$(tr).hasClass('child')) {
        if (!$(tr).hasClass('selected')) {
          $('#notify-table tbody .selected').removeClass('selected');
          $(tr).addClass('selected');
        }
      }
    },

    //get selected row index and show dialog, alert when fail
    openSelectedRow() {
      var notifiy = this.table.row($('#notify-table .selected').index()).data();

      if (notifiy) {
        //display target dialog
        this.showDialog(notifiy);
      } else {
        //display no selection error massage
        this.$modal.show('dialog', {
          title:
            "<span class='text-yellow'><i class='fa fa-exclamation-triangle'></i> Alert! </span>",
          template:
            "<h4 style='text-align:center;'>You need to select a item</h4>",
          maxWidth: 300,
          buttons: [
            {
              title: 'Ok',
              default: true
            }
          ]
        });
      }
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
