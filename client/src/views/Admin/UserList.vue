<!--
 - @author: Wei Zheng
 - @description: display all users by using datatable server process.
 -->

<template>
  <div>
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
          <table id="user-table" class="table table-hover display" style="width:100%;">
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
import router from '@/router';


export default {
  data() {
    return {
      loading: false,
      table: null
    };
  },

  computed: {
    ...mapState('authentication', ['user'])
  },

  mounted() {
    this.initiateTable();
  },

  methods: {
    ...mapActions('errorStore', ['setGlobalError']),

    //initialize data table
    initiateTable() {
      // base url for http request
      const baseURL =this.$store.getters.baseURL;
      // jwt token
      const header = {
        Authorization: `Bearer ${this.$store.state.authentication.token}`
      };
      const self = this;

      self.table = $('#user-table')
        .on('processing.dt', function(e, settings, processing) {
          // loading icon
          self.loading = processing;
        })
        .DataTable({
          //resize based on widht
          responsive: true,
          //order by first col in ascending order
          order: [[0, 'desc']],
          iDisplayLength: 20,
          lengthMenu: [10, 20, 40, 60, 80, 100],
          deferRender: false,
          serverSide: true,
          data: [],
          columns: [
            { data: 'id', title: 'ID' },
            { data: 'full_name', title: 'User Name' },
            { data: 'role', title: 'Role' },
            { data: 'email', title: 'Email' },
            { data: 'created_at', title: 'Join Date' }
          ],
          searchDelay: 600,
          ajax: {
            type: 'POST',
            url: baseURL + '/user/datatable',
            headers: header,

            dataSrc: ({ data }) => {
              return data;
            }
          },
          createdRow: function(row, data, dataIndex) {
            //bold id
            $(row)
              .find('td:eq(0)')
              .css('font-weight', 'bold');
          },
          initComplete: function() {
            //click select event
            $('#user-table tbody').on('click', 'tr', function() {
              self.addTableSelect(this);
            });

            //double click event
            $('#user-table tbody').on('dblclick', 'tr', function() {
              if (!$(this).hasClass('child')) {
                self.showChanegRoleDialog(
                  self.table.row($(this).index()).data()
                );
              }
            });

            var touched = false;
            //double tab event
            $('#user-table tbody').on('touchstart', 'tr', function(e) {
              if (!$(this).hasClass('child')) {
                self.addTableSelect(this);
                if (!touched) {
                  touched = true;
                  setTimeout(() => {
                    touched = false;
                  }, 200);
                } else {
                  self.showChanegRoleDialog(
                    self.table.row($(this).index()).data()
                  );
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
          $('#user-table tbody .selected').removeClass('selected');
          $(tr).addClass('selected');
        }
      }
    },

    //get selected row index and show dialog, alert when fail
    openSelectedRow(callBack) {
      var selectedUser = this.table
        .row($('#user-table .selected').index())
        .data();

      if (selectedUser) {
        //display target dialog
        callBack(selectedUser);
      } else {
        //display no selection error massage
        this.$modal.show('dialog', {
          title:
            "<span class='text-yellow'><i class='fa fa-exclamation-triangle'></i> Alert! </span>",
          template:
            "<h4 style='text-align:center;'>You need to select a user</h4>",
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

    //display delete user dialog
    showDeleteDialog(user) {
      this.$modal.show('dialog', {
        title: `<span class='text-red'><i class='fa fa-trash'></i> Delete User</span>`,
        maxWidth: 300,
        template: this.getDeleteTemplate(user),
        buttons: [
          {
            title: 'Confirm',
            default: true,
            handler: spinner => {
              //if acknowledge checkbox is checked, perform delete request
              //else show alert
              if (!$('.acknowledge-ck').is(':checked')) {
                $('.acknowledge-ck')
                  .parent()
                  .addClass('text-red');
              } else {
                spinner.loading = true;
                //verify and remove user from database
                HTTP()
                  .delete(`/user/${user.id}`)
                  .then(({ data }) => {
                    //if return data not exist, push for error
                    if (!data) {
                      $('.dialog-error').text('Something is wrong');
                    } else {
                      //remove row from table and hide dialog
                      this.table.ajax.reload(null, false);
                      this.$modal.hide('dialog');
                    }
                  })
                  .catch(e => {
                    $('.dialog-error').text(e.response.data.error);
                  })
                  .finally(() => {
                    spinner.loading = false;
                  });
              }
            }
          },
          {
            title: 'Cancel'
          }
        ]
      });
    },

    //display dialog
    showChanegRoleDialog(user) {
      this.$modal.show('dialog', {
        title: `<i class='fa fa-user-circle'></i> Change Role`,
        maxWidth: 300,
        template: this.getRoleTemplate(user),
        buttons: [
          {
            title: 'Confirm',
            default: true,
            handler: spinner => {
              //http request to change user role.
              var newRole = $('.role-selector option:selected').text();
              //close dialog if selected role did not change
              //else do http request for role changing
              if (newRole === user.role) {
                this.$modal.hide('dialog');
              } else {
                spinner.loading = true;
                HTTP()
                  .patch(`/user/${user.id}`, { role: newRole })
                  .then(({ data }) => {
                    //if return data not exist, push for error
                    if (!data) {
                      $('.dialog-error').text('Something is wrong');
                    } else {
                      //change table data
                      this.table.ajax.reload(null, false);
                      this.$modal.hide('dialog');
                    }
                  })
                  .catch(e => {
                    $('.dialog-error').text(e.response.data.error);
                  })
                  .finally(() => {
                    spinner.loading = false;
                  });
              }
            }
          },
          {
            title: 'Cancel'
          }
        ]
      });
    },

    //get user information template
    getUserInfo(user) {
      var template = ` <label>User Name</label>
        <p class='capitalize'>${user.full_name}</p>
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
          <option ${this.getSelectedRole(user, 'Client')}>Client</option>
          <option ${this.getSelectedRole(user, 'Admin')}>Admin</option>
          <option ${this.getSelectedRole(user, 'Developer')}>Developer</option>
        </select>`;

      return template;
    },

    // allow dropdown box to select current role
    getSelectedRole(user, role) {
      if (user.role === role) return 'selected="selected"';
      return '';
    }
  }
};
</script>

<style>
#user-table .selected {
  background-color: lightgrey !important;
}
</style>
