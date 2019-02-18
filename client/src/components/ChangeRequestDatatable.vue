<template>
  <table id="change-request-table" class="table table-hover display" style="width:100%;">
    <thead>
      <tr>
        <th v-for="th in header" :class="th.class">{{th.text}}</th>
      </tr>
      <!-- Datatable filter dropdown-->
      <tr v-if="filter">
        <th v-for="th in header" :class="th.class+'-ex'"></th>
      </tr>
    </thead>
    <tbody></tbody>
  </table>
</template>

<script>
import router from '@/router';
import { mapState } from 'vuex';
export default {
  props: {
    header: Array,
    columns: Array,
    data: Array,
    filter: Array,
    spinner: Object,
    order: Array,
    dlength: Number,
    statusPos: Number
  },

  data() {
    return {
      table: null
    };
  },

  watch: {
    data() {
      this.updateTable();
    }
  },

  computed: {
    ...mapState('changeRequest', ['tab'])
  },

  mounted() {
    this.initiateTable();
  },

  methods: {
    //update table
    updateTable() {
      var self = this;
      self.table
        .clear()
        .rows.add(self.data)
        .draw();

      if (self.filter) {
        self.table.columns(self.filter).every(function() {
          self.setTableFilter(this);
        });
        $('.select2').select2({ width: '80%' });
      }
      //hide spinner
      self.spinner.loading = false;
    },

    //initialize data table
    initiateTable(data) {
      var self = this;
      //set timeout give a pause for data to setup
      self.table = $('#change-request-table').DataTable({
        destroy: true,
        data: self.data,
        processing: true,
        responsive: true,
        deferRender: true,
        columns: self.columns,
        //order by, default 0 desc
        order: [self.order || [0, 'desc']],
        // number of item display, default 20
        iDisplayLength: self.dlength || 20,
        lengthMenu: [10, 20, 40, 60, 80, 100],

        orderCellsTop: true,

        createdRow: function(row, data, dataIndex) {
          $(row)
            .find('td')
            .eq(self.statusPos || 2).html(`
            <label
                style="padding: 5px 10px;"
                class="label ${self.getStatusLabel(data.status)}"
            >${data.status}</label>`);
          $(row)
            .find('td:eq(0)')
            .css('font-weight', 'bold');
        },

        initComplete: function() {
          if (self.filter) {
            this.api()
              .columns(self.filter)
              .every(function() {
                self.setTableFilter(this);
              });
            $('.select2').select2({ width: '80%', allowClear: true });
            self.spinner.loading = false;
          }
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

      var touched = false;
      //double tab event.
      $('#change-request-table tbody').on('touchstart', 'tr', function(e) {
        if (!$(this).hasClass('child')) {
          self.addTableSelect(this);
          if (!touched) {
            touched = true;
            setTimeout(() => {
              touched = false;
            }, 200);
          } else {
            self.showRequestDetail(
              $(this)
                .find('td:eq(0)')
                .text()
            );
          }
        }
      });
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
        '<select class="select2 js-states form-control "><option value="">ALL</option></select>'
      ).on('change', function() {
        var val = $.fn.dataTable.util.escapeRegex($(this).val());
        column.search(val ? '^' + val + '$' : '', true, false).draw();
      });

      column
        .data()
        .unique()
        .sort()
        .each(function(d, j) {
          select.append('<option value="' + d + '">' + d + '</option>');
        });

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
#change-request-table .select2-selection__rendered {
  padding: 0 !important;
}
#change-request-table .select2-selection__arrow {
  display: none;
}
</style>
