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
                  <select id="select2" class="js-states form-control" multiple="multiple"></select>
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
          <div class="form-group">
            <button class="btn btn-lg btn-primary" style="width:50%;">
              <i class="fa fa-search"></i> Search
            </button>
            <input type="reset" class="btn btn-lg btn-secondary" style="width:50%;" @click="clear">
          </div>
        </div>
        <!-- /.box-body -->
      </form>

      <div class="col-md-6 box box-primary">
        <div v-if="loading" class="overlay">
          <i class="fa fa-refresh fa-spin"></i>
        </div>
        <div class="box-body">
          <table id="change-request-table" class="table table-hover display" style="width:100%;">
            <thead>
              <tr>
                <th>ID</th>
                <th>Client</th>
                <th>Status</th>
                <th>Creation</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import HTTP from '@/http';
import router from '@/router';
export default {
  data() {
    return {
      filter: {},
      table: null,
      loading: false
    };
  },
  computed: {
    ...mapState('changeRequest', ['listTab', 'tab'])
  },

  mounted() {
    this.initSelect2(this);
    this.initDateRange(this);
    this.initDataTable(this);
  },

  methods: {
    ...mapActions('errorStore', ['setGlobalError']),

    initDataTable(self) {
      this.table = $('#change-request-table').DataTable({
        destroy: true,
        data: null,
        processing: true,
        columns: [
          { data: 'id' },
          { data: 'clientName' },
          { data: 'status' },
          { data: 'created_at' }
        ],
        createdRow: function(row, data, dataIndex) {
          $(row).find('td:eq(2)').html(`
            <label
                style="padding: 5px 10px;"
                class="label ${self.getStatusLabel(data.status)}"
            >${data.status}</label>`);
        },
        initComplete: function() {
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
        }
      });
    },

    initSelect2(self) {
      //initialize select2 for client search
      $('#select2').select2({
        width: '100%',
        allowClear: true,
        multiple: true,
        closeOnSelect: false,
        ajax: {
          delay: 250,
          transport: function({ data }, success, failure) {
            HTTP()
              .post('user/search/all', {
                term: data.term || '',
                page: data.page || 1
              })
              .then(({ data }) => {
                success(data);
              })
              .catch(e => {
                failure(e);
              });
          },
          processResults: function(data, params) {
            // use full name as text and id for the options
            data.results.forEach(d => {
              d.text = d.full_name;
              d.id = d.full_name;
            });
            return data;
          }
        }
      });

      //bind select2 data to filter clients
      $('#select2').on('change', function() {
        self.filter.clientsName = $(this).val();
      });
    },

    initDateRange(self) {
      //Date range picker
      $('#daterange').daterangepicker(
        {
          autoUpdateInput: true
        },
        function(start, end) {
          self.filter.date =
            start.format('YYYY-MM-DD') + '/' + end.format('YYYY-MM-DD');
        }
      );
      // empty date by default
      $('#daterange').val('');
    },

    //clear all data
    clear() {
      this.updateTable([]);
      $('#select2')
        .val(null)
        .trigger('change');
      this.filter = {};
    },

    addTableSelect(tr) {
      if (!$(tr).hasClass('child')) {
        if (!$(tr).hasClass('selected')) {
          $('#change-request-table tbody .selected').removeClass('selected');
          $(tr).addClass('selected');
        }
      }
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
    //update table
    updateTable(data) {
      this.table
        .clear()
        .rows.add(data)
        .draw();
      this.loading = false;
    },

    //begin searching
    beginSearch() {
      this.loading = true;
      return HTTP()
        .post('/change-request/list', this.filter)
        .then(({ data }) => {
          this.updateTable(data);
        })
        .catch(e => {
          this.setGlobalError(e);
        });
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
.dataTable .dataTables_empty {
  min-height: 300px;
  font-size: 150%;
  padding: 10% 0;
}
</style>
