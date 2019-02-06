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
            class="table table-bordered table-hover display nowrap"
            style="width:100%"
          >
            <thead>
              <tr>
                <th style="max-width:20px">ID</th>

                <th style="width:75px; text-align:center;">Status</th>
                <th style="width:100px">Creation</th>
                <th style="width:100px">Last Update</th>
                <th>Request Title</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(changeRequest, i) in ChangeRequestList" :id="i">
                <th>{{changeRequest.id}}</th>
                <td style="text-align:center;">
                    
                  <label
                    class="label"
                    style="padding: 5px 10px;"
                    :class="getStatusLabel(changeRequest.status)"
                  >{{changeRequest.status}}</label>
                </td>
                <td>{{changeRequest.created_at.split(" ")[0]}}</td>
                <td>{{changeRequest.updated_at.split(" ")[0]}}</td>
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
import { mapState, mapActions } from "vuex";
import HTTP from "@/http";
import router from "@/router";

export default {
  data() {
    return {
      ChangeRequestList: null
    };
  },

  computed: {
    ...mapState("authentication", ["user"])
  },

  created() {
    /* //verify user's role
    if (this.user.role !== "Admin" && this.user.role !== "Developer") {
      this.setGlobalError("Only admin allows to enter this page");
      router.push("/");
    } */

    //fetch ChangeRequest list
    this.fetchChangeRequestList();
  },

  methods: {
    ...mapActions("errorStore", ["setGlobalError"]),

    // fetch dev todo list
    fetchChangeRequestList() {
      return HTTP()
        .get("/change-request")
        .then(({ data }) => {
          this.ChangeRequestList = data;
          this.initiateTable();
        })
        .catch(e => {
          this.setGlobalError(e);
          router.push("/");
        });
    },

    //initialize data table
    initiateTable() {
      var _showRequestDetail = this.showRequestDetail;
      setTimeout(() => {
        var table = $("#change-request-table").DataTable({
          //resize based on widht
          responsive: true,
          //order by third col in ascending order
          order: [[2, "asc"]]
        });

        //click select event
        $("#change-request-table tbody").on("click", "tr", function() {
          if ($(this).hasClass("selected")) {
            $(this).removeClass("selected");
          } else {
            table.$("tr.selected").removeClass("selected");
            $(this).addClass("selected");
          }
        });

        //double click event
        $("#change-request-table tbody").on("dblclick", "tr", function() {
          self.requestID = $(this).find('th').text();
          _showRequestDetail(requestID);
        });
      }, 10);
    },

    //get selected row index and show dialog, alert when fail
    openSelectedRow() {
      var requestID = $("#change-request-table .selected th").text();

      if (requestID) {
        //display target dialog
        this.showRequestDetail(requestID);
      } else {
        //display no selection error massage
        this.$modal.show("dialog", {
          title:
            "<span class='text-yellow'><i class='fa fa-exclamation-triangle'></i> Alert! </span>",
          template:
            "<h4 style='text-align:center;'>You need to select a request</h4>",
          maxWidth: 300,
          buttons: [
            {
              title: "Ok",
              default: true
            }
          ]
        });
      }
    },

    //direct to change request detail view
    showRequestDetail(id){
      router.push(`change-request/${id}`);
    },

    //get status label class
    getStatusLabel(status) {
      {
        switch (status) {
          case "To Do":
            return "label-warning";
          case "Process":
            return "label-primary";
          case "Completed":
            return "label-success";
          default:
            return "label-danger";
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
