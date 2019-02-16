<template>
  <div v-if="ChangeRequestList">
    <section class="content">
      <div class="nav-tabs-custom">
        <ul class="nav nav-tabs pull-right">
          <li class="dropdown" :class="isOtherTab">
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

          <a class="pull-right btn btn-app addTodoBtn bg-blue" @click="openSelectedRow">
            <i class="fa fa-eye"></i>Review
          </a>
          <li class="pull-left header">
            <h1 style="padding:0; margin:0; font-size:24px; ">
              <i class="fa fa-th-list"></i>
              &nbsp;&nbsp;Change Request Manage
            </h1>
          </li>
        </ul>
        <div class="tab-content">
          <div class="tab-pane active">
            <div class="box">
              <div v-if="loading" class="overlay">
                <i class="fa fa-refresh fa-spin"></i>
              </div>
              <div class="box-body">
                <table
                  id="change-request-table"
                  class="table table-hover display"
                  style="width:100%;"
                >
                  <thead>
                    <tr>
                      <th class="all">ID</th>
                      <th class="all">Client</th>
                      <th class="all">Status</th>
                      <th class="not-mobile">Creation</th>
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
                      <th class="mobile-hide"></th>
                      <th class="tablet-hide"></th>
                      <th class="tablet-hide"></th>
                      <th class="tablet-hide"></th>
                      <th style="display:none;"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <!-- <tr v-for="(changeRequest, i) in ChangeRequestList" :id="i">
                      <th>{{changeRequest.id}}</th>
                      <td>{{changeRequest.clientName}}</td>
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
                    </tr>-->
                  </tbody>
                </table>
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
import { mapState, mapActions, mapMutations } from 'vuex';
import HTTP from '@/http';
import router from '@/router';

export default {
  data() {
    return {
      ChangeRequestList: null,
      loading: false,
      table: null
    };
  },

  watch: {
    //fetch data when listTab changed
    listTab() {
      this.fetchChangeRequestList(this.updateTable);
    }
  },

  computed: {
    ...mapState('changeRequest', ['listTab', 'tab'])
  },

  created() {
    this.fetchChangeRequestList(this.initiateTable);
  },

  methods: {
    ...mapActions('errorStore', ['setGlobalError']),
    ...mapMutations('changeRequest', ['setListTab']),

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

    // fetch change request list, filter by tab
    fetchChangeRequestList(tableCallback) {
      //display spinner when request start, hide spinner when table finish initializing
      this.loading = true;
      return HTTP()
        .post('/change-request/list', { method: 'tab', tab: this.listTab })
        .then(({ data }) => {
          this.ChangeRequestList = data;
          tableCallback(data);
        });
    },

    //update table
    updateTable(data) {
      var self = this;
      this.table
        .clear()
        .rows.add(data)
        .draw();
      this.loading = false;
      this.table.columns([0, 1, 2, 3, 4, 5, 6]).every(function() {
        self.setTableFilter(this);
      });
      $('.select2').select2({ width: '80%' });
      self.loading = false;
    },

    //initialize data table
    initiateTable(data) {
      var self = this;
      //set timeout give a pause for data to setup
      setTimeout(() => {
        this.table = $('#change-request-table').DataTable({
          destroy: true,
          data: data,
          columns: [
            { data: 'id' },
            { data: 'clientName' },
            { data: 'status' },
            { data: 'created_at' },
            { data: 'updated_at' },
            { data: 'totalMessage' },
            { data: 'totalHistory' },
            { data: 'title' }
          ],
          createdRow: function(row, data, dataIndex) {
            $(row).find('td:eq(2)').html(`
            <label
                style="padding: 5px 10px;"
                class="label ${self.getStatusLabel(data.status)}"
            >${data.status}</label>`);
          },
          //resize based on widht
          responsive: true,
          //order by third col in ascending order
          order: [[4, 'desc']],
          iDisplayLength: 20,
          lengthMenu: [10, 20, 40, 60, 80, 100],

          orderCellsTop: true,
          initComplete: function() {
            this.api()
              .columns([0, 1, 2, 3, 4, 5, 6])
              .every(function() {
                self.setTableFilter(this);
              });
            $('.select2').select2({ width: '80%' });
            self.loading = false;
          }
        });

        //click select event
        $('#change-request-table tbody').on('click', 'tr', function() {
          self.addTableSelect(this);
        });

        //double click event
        $('#change-request-table tbody').on('dblclick', 'tr', function() {
          if (!$(this).hasClass('child')) {
            self.showRequestDetail(
              $(this)
                .find('td:eq(0)')
                .text()
            );
          }
        });

        var touched = null;
        //touch down event, Open detal page if touch over 0.5 second
        $('#change-request-table tbody').on('touchstart', 'tr', function(e) {
          if (!$(this).hasClass('child')) {
            self.addTableSelect(this);
            touched = setTimeout(() => {
              self.showRequestDetail(
                $(this)
                  .find('td:eq(0)')
                  .text()
              );
            }, 500);
            e.preventDefault();
          }
        });
        //top touch count down
        $('#change-request-table tbody').on('touchend', 'tr', function() {
          clearTimeout(touched);
        });
      }, 10);
    },

    //get selected row index and show dialog, alert when fail
    openSelectedRow() {
      var requestID = $('#change-request-table .selected td:eq(0)').text();

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

    setTableFilter(column) {
      var select = $(
        '<select class="select2"><option value="">ALL</option></select>'
      ).on('change', function() {
        var val = $.fn.dataTable.util.escapeRegex($(this).val());
        column.search(val ? '^' + val + '$' : '', true, false).draw();
      });
      if (column.index() === 2) {
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
            select.append('<option value="' + d + '">' + d + '</option>');
          });
      }

      $(`#change-request-table thead tr:eq(1) th:eq(${column.index()})`).html(
        select
      );
    },

    addTableSelect(tr) {
      if (!$(tr).hasClass('child')) {
        if (!$(tr).hasClass('selected')) {
          $('#change-request-table tbody .selected').removeClass('selected');
          $(tr).addClass('selected');
        }
      }
    },

    //direct to change request detail view
    showRequestDetail(id) {
      router.push(`/change-request/${id}/${this.tab}`);
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
.select2-selection__rendered {
  padding: 0 !important;
}
</style>
