<!--
 - @author: Wei Zheng
 - @description: change request detatable used in ChangeRequestList and ChangeRequestSearch
 -->

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
import rowEvent from '@/mixin/rowEvent.js';
import helper from '@/mixin/helper.js';

export default {
  mixins: [rowEvent, helper],

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

  watch: {
    data() {
      this.updateTable();
    }
  },

  computed: {
    ...mapState('crStore', ['tab'])
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
      }
      //hide spinner
      self.spinner.loading = false;
    },

    //initialize data table
    initiateTable() {
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
                class="label ${self.getStatusCSS('label', data.status)}"
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
          }
          //add row event
          self.addRowSelectEvent('#change-request-table', target => {
            //show request detail after click
            self.showRequestDetail(
              $(target)
                .find('td:eq(0)')
                .text()
            );
          });

          self.spinner.loading = false;
        }
      });
    },

    //get selected row index and show dialog, alert when fail
    beforeOpenSelectedRow() {
      var requestID = $('#change-request-table .selected td:eq(0)').text();
      //use open select row from selectRow event mixin
      this.openSelectedRow(this.showRequestDetail, requestID);
    },

    setTableFilter(column) {
      var select = $(`<select><option value="">ALL</option></select>`).on(
        'change',
        function() {
          var val = $.fn.dataTable.util.escapeRegex($(this).val());
          column.search(val ? '^' + val + '$' : '', true, false).draw();
        }
      );

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
    }
  }
};
</script>

<style>
#change-request-table .selected {
  background-color: lightgrey !important;
}
#change-request-table select {
  width: 100%;
}
@media (max-width: 480px) {
  #change-request-table select {
    font-size: 80%;
    padding: 0;
  }
}
</style>
