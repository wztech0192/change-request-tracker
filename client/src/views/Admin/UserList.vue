<template>
  <div v-if="userList">
    <section class="content-header">
      <h1>
        <i class="fa fa-users"></i>&nbsp;&nbsp;User List
      </h1>
      <div class="pull-right" style="margin-top:-30px">
        <div class="btn-group">
          <button
            type="button"
            class="btn btn-primary"
            @click="openSelectedRow(showChanegRoleDialog)"
          >
            <span class="mobile-hide">Role &nbsp;</span>
            <i class="fa fa-edit"></i>
          </button>
          <button
            type="button"
            class="btn btn-secondary"
            @click="openSelectedRow(showDeleteDialog)"
          >
            <span class="mobile-hide">Delete &nbsp;</span>
            <i class="fa fa-trash"></i>
          </button>
        </div>
      </div>
    </section>
    <section class="content">
      <div class="box">
        <div class="box-body">
          <table
            id="user-table"
            class="table table-bordered table-hover display nowrap"
            style="width:100%"
          >
            <thead>
              <tr>
                <th width="20px">#</th>
                <th>User Name</th>
                <th>Role</th>
                <th>Email</th>
                <th>Join On</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(user, i) in userList" :id="i">
                <th>{{i+1}}</th>
                <td
                  class="capitalize"
                >{{user.first_name}} {{user.mid_initial || ""}} {{user.last_name}}</td>
                <td>{{user.role}}</td>
                <td>{{user.email}}</td>
                <td>{{user.created_at}}</td>
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
      userList: null
    };
  },

  computed: {
    ...mapState("authentication", ["user"])
  },

  created() {
    //verify user's role
    if (this.user.role !== "Admin" && this.user.role !== "Developer") {
      this.setGlobalError("Only admin are allow to enter this page");
      router.push("/");
    } else {
      //fetch user list
      this.fetchUserList();
    }
  },

  methods: {
    ...mapActions("errorStore", ["setGlobalError"]),

    // fetch dev todo list
    fetchUserList() {
      return HTTP()
        .get("/user/all")
        .then(({ data }) => {
          this.userList = data;
          this.initiateTable();
        })
        .catch(e => {
          this.setGlobalError(e);
          router.push("/");
        });
    },

    //initialize data table
    initiateTable() {
      var _showChanegRoleDialog = this.showChanegRoleDialog;
      setTimeout(() => {
        var table = $("#user-table").DataTable({
          //resize based on widht
          responsive: true,
          //order by first col in ascending order
          order: [[0, "asc"]]
        });

        //click select event
        $("#user-table tbody").on("click", "tr", function() {
          if ($(this).hasClass("selected")) {
            $(this).removeClass("selected");
          } else {
            table.$("tr.selected").removeClass("selected");
            $(this).addClass("selected");
          }
        });

        //double click event
        $("#user-table tbody").on("dblclick", "tr", function() {
          var i = $(this).attr("id");
          _showChanegRoleDialog(i);
        });
      }, 10);
    },

    //get selected row index and show dialog, alert when fail
    openSelectedRow(callBack) {
      var selectIndex = $("#user-table .selected").attr("id");
      if (selectIndex) {
        //display target dialog
        callBack(selectIndex);
      } else {
        //display no selection error massage
        this.$modal.show("dialog", {
          title:
            "<span class='text-yellow'><i class='fa fa-exclamation-triangle'></i> Alert! </span>",
          template:
            "<h4 style='text-align:center;'>You need to select a user</h4>",
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

    //display delete user dialog
    showDeleteDialog(selectIndex) {
      var user = this.userList[selectIndex];
      this.$modal.show("dialog", {
        title: `<span class='text-red'><i class='fa fa-trash'></i> Delete User</span>`,
        maxWidth: 300,
        template: this.getDeleteTemplate(user),
        buttons: [
          {
            title: "Confirm",
            default: true,
            handler: spinner => {
              //if acknowledge checkbox is checked, perform delete request
              //else show alert
              if (!$(".acknowledge-ck").is(":checked")) {
                $(".acknowledge-ck")
                  .parent()
                  .addClass("text-red");
              } else {
                spinner.loading = true;
                //verify and remove user from database
                HTTP()
                  .delete(`/user/${user.id}`)
                  .then(({ data }) => {
                    //if return data not exist, push for error
                    if (!data) {
                      $(".dialog-error").text("Something is wrong");
                    } else {
                      //remove row from table and hide dialog
                      $("#user-table")
                        .DataTable()
                        .row($("#user-table .selected"))
                        .remove()
                        .draw();
                      this.$modal.hide("dialog");
                    }
                  })
                  .catch(e => {
                    $(".dialog-error").text(e.response.data.error);
                  })
                  .finally(() => {
                    spinner.loading = false;
                  });
              }
            }
          },
          {
            title: "Cancel"
          }
        ]
      });
    },

    //display dialog
    showChanegRoleDialog(selectIndex) {
      var user = this.userList[selectIndex];
      this.$modal.show("dialog", {
        title: `<i class='fa fa-user-circle'></i> Change Role`,
        maxWidth: 300,
        template: this.getRoleTemplate(user),
        buttons: [
          {
            title: "Confirm",
            default: true,
            handler: spinner => {
              //http request to change user role.
              var newRole = $(".role-selector option:selected").text();
              //close dialog if selected role did not change
              //else do http request for role changing
              if (newRole === user.role) {
                this.$modal.hide("dialog");
              } else {
                spinner.loading = true;
                HTTP()
                  .patch(`/user/${user.id}`, { role: newRole })
                  .then(({ data }) => {
                    //if return data not exist, push for error
                    if (!data) {
                      $(".dialog-error").text("Something is wrong");
                    } else {
                      //change table data
                      user.role = newRole;
                      this.$modal.hide("dialog");
                    }
                  })
                  .catch(e => {
                    $(".dialog-error").text(e.response.data.error);
                  })
                  .finally(() => {
                    spinner.loading = false;
                  });
              }
            }
          },
          {
            title: "Cancel"
          }
        ]
      });
    },

    //get user information template
    getUserInfo(user) {
      var template = ` <label>User Name</label>
        <p class='capitalize'>${user.first_name} ${user.mid_initial || ""} ${
        user.last_name
      }</p>
        <label>User Email</label>
        <p>${user.email}</p>`;
      return template;
    },

    getDeleteTemplate(user) {
      var template = `${this.getUserInfo(user)}  
          <label>User Role</label> 
          <p>${user.role}</p>
          <hr>
          <label>
            <i class='fa fa-exclamation-triangle'>
            </i>&nbsp;&nbsp;Warning!
          </label>
          <h5>
            Are you sure you want to delete this user from the site? 
            This process cannot be undone. 
          </h5>
          <label>
            <input class='acknowledge-ck' type='checkbox'> 
            &nbsp;Action Acknowledged - Required
          </label>
          `;

      return template;
    },

    getRoleTemplate(user) {
      var template = `${this.getUserInfo(user)}
        <label>User Role</label>
        <select class="form-control role-selector" style="width: 100%;">
          <option ${this.getSelectedRole(user, "Client")}>Client</option>
          <option ${this.getSelectedRole(user, "Admin")}>Admin</option>
          <option ${this.getSelectedRole(user, "Developer")}>Developer</option>
        </select>`;

      return template;
    },

    // allow dropdown box to select current role
    getSelectedRole(user, role) {
      if (user.role === role) return 'selected="selected"';
      return "";
    }
  }
};
</script>

<style>
#user-table .selected {
  background-color: lightgrey !important;
}
</style>
