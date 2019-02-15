<template>
  <div v-if="ChangeRequestList">
    <section class="content-header">
      <h1>
        <i class="fa fa-th-list"></i>&nbsp;&nbsp;Change Request List
      </h1>
      <div class="pull-right" style="margin-top:-30px">
        <button type="button" class="btn btn-primary" @click="openSelectedRow">
          <span class="mobile-hide">Review &nbsp;</span>
          <i class="fa fa-eye"></i>
        </button>
      </div>
    </section>
    <section class="content">
      <div class="box">
        <div class="box-body">
          <table
            id="change-request-table"
            class="table table-bordered table-hover display"
            style="width:100%;"
          >
            <thead>
              <tr>
                <th class="all">ID</th>
                <th class="all">Status</th>
                <th class="all">Creation</th>
                <th class="desktop">Last Update</th>
                <th class="desktop">Messages</th>
                <th class="desktop">Hitories</th>
                <th class="none">Title</th>
              </tr>
              <!-- Datatable filter dropdown-->
              <tr>
                <th class="all"></th>
                <th class="all"></th>
                <th class="all"></th>
                <th class="tablet-hide"></th>
                <th class="tablet-hide"></th>
                <th class="tablet-hide"></th>
                <th style="display:none;"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(changeRequest, i) in ChangeRequestList" :id="i">
                <th>{{changeRequest.id}}</th>
                <td>
                  <label
                    class="label"
                    style="padding: 5px 10px;"
                    :class="getStatusLabel(changeRequest.status)"
                  >{{changeRequest.status}}</label>
                </td>
                <td>{{changeRequest.created_at.split(" ")[0]}}</td>
                <td>{{changeRequest.updated_at.split(" ")[0]}}</td>
                <td>{{changeRequest.totalMessage}}</td>
                <td>{{changeRequest.totalHistory}}</td>
                <td>{{changeRequest.title}}</td>
              </tr>
            </tbody>
          </table>
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
import router from '@/router';

export default {
  data() {
    return {
      ChangeRequestList: null
    };
  },

  computed: {
    ...mapState('authentication', ['user']),
    ...mapState('changeRequest', ['tab'])
  },

  created() {
    //fetch ChangeRequest list
    this.fetchChangeRequestList();
  },

  methods: {
    ...mapActions('errorStore', ['setGlobalError']),

    // fetch dev todo list
    fetchChangeRequestList() {
      return HTTP()
        .get('/change-request')
        .then(({ data }) => {
          this.ChangeRequestList = data;
          this.initiateTable();
        })
        .catch(e => {
          this.setGlobalError(e);
          router.push('/');
        });
    },

    //initialize data table
    initiateTable() {
      var _showRequestDetail = this.showRequestDetail;
      setTimeout(() => {
        var table = $('#change-request-table').DataTable({
          //resize based on widht
          responsive: true,
          //order by third col in ascending order
          order: [[3, 'desc']],
          iDisplayLength: 20,
          lengthMenu: [10, 20, 40, 60, 80, 100],

          orderCellsTop: true,
          initComplete: function() {
            this.api()
              .columns([0, 1, 2, 3, 4, 5])
              .every(function() {
                var column = this;
                var select = $(
                  '<select class="select2"><option value="">ALL</option></select>'
                ).on('change', function() {
                  var val = $.fn.dataTable.util.escapeRegex($(this).val());
                  column.search(val ? '^' + val + '$' : '', true, false).draw();
                });
                if (column.index() === 1) {
                  select.append(
                    '<option value="Cancelled">Cancelled</option>',
                    '<option value="To Do">To Do</option>',
                    '<option value="In Progress">In Progress</option>',
                    '<option value="Complete">Complete</option>'
                  );
                } else {
                  column
                    .data()
                    .unique()
                    .sort()
                    .each(function(d, j) {
                      select.append(
                        '<option value="' + d + '">' + d + '</option>'
                      );
                    });
                }

                $(
                  `#change-request-table thead tr:eq(1) th:eq(${column.index()})`
                ).html(select);
              });
            $('.select2').select2({ width: '80%' });
          }
        });

        //click select event
        $('#change-request-table tbody').on('click', 'tr', function() {
          if (!$(this).hasClass('child')) {
            if ($(this).hasClass('selected')) {
              $(this).removeClass('selected');
            } else {
              table.$('tr.selected').removeClass('selected');
              $(this).addClass('selected');
            }
          }
        });

        //double click event
        $('#change-request-table tbody').on('dblclick', 'tr', function() {
          if (!$(this).hasClass('child')) {
            var requestID = $(this)
              .find('th')
              .text();
            _showRequestDetail(requestID);
          }
        });
      }, 10);
    },

    //get selected row index and show dialog, alert when fail
    openSelectedRow() {
      var requestID = $('#change-request-table .selected th').text();

      if (requestID) {
        //display target dialog
        this.showRequestDetail(requestID);
      } else {
        //display no selection error massage
        this.$modal.show('dialog', {
          title:
            "<span class='text-yellow'><i class='fa fa-exclamation-triangle'></i> Alert! </span>",
          template:
            "<h4 style='text-align:center;'>You need to select a request</h4>",
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

    //direct to change request detail view
    showRequestDetail(id) {
      router.push(`change-request/${id}/${this.tab}`);
    },

    //get status label class
    getStatusLabel(status) {
      {
        switch (status) {
          case 'To Do':
            return 'label-warning';
          case 'In Progress':
            return 'label-primary';
          case 'Complete':
            return 'label-success';
          default:
            return 'label-danger';
        }
      }
    }
  }
};
</script>

<style>
#change-request-table .selected {
  background-color: lightgrey !important;
}
</style>
