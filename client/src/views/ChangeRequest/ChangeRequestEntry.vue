<!--
 - @author: Wei Zheng
 - @description: allow client to submit change request, and admin to submit
 -               change request on the behavior of selected client.
 -->


<template>
  <div>
    <section class="content-header">
      <h1>
        <i class="fa fa-edit"></i>&nbsp;&nbsp;Change Request Entry
      </h1>
    </section>
    <section class="content">
      <div class="row">
        <div class="col-md-8">
          <form class="box" @submit.prevent="submitRequest">
            <div class="box-body form-background">
              <span class="pull-right">
                <a
                  class="register-resetbtn btn btn-social-icon"
                  @click.prevent="clearAllData"
                  data-toggle="tooltip"
                  title="Reset All Input"
                >
                  <i class="fa fa-repeat"></i>
                </a>
              </span>
              <br>

              <!-- Select a client for the request if user is admin -->
              <div v-if="isAdmin">
                <div class="form-group">
                  <label :class="{'text-red':error.client_error}">
                    <i class="fa fa-user"></i> Client
                    <span v-if="error.client_error">-- Client Cannot be empty</span>
                  </label>

                  <UserSearch
                    ref="usersearch"
                    searchRole="Client"
                    :onChange="userChange"
                    :useEmailID="true"
                  >
                    <option
                      v-if="requestData.client"
                      :value="requestData.client"
                    >{{requestData.client}}</option>
                  </UserSearch>
                </div>
              </div>

              <!-- Title input  -->
              <label :class="{'text-red':error.title_error}">
                Request Title
                <span v-if="error.title_error">-- Title Cannot be empty</span>
              </label>
              <div class="input-group" :class="{'has-error':error.title_error}">
                <span class="input-group-addon">
                  <i class="fa fa-info-circle"></i>
                </span>
                <input
                  class="form-control"
                  @blur="clearError('title')"
                  :value="requestData.title"
                  @input="setTitle"
                >
              </div>

              <br>

              <!-- Detail input  -->
              <label :class="{'text-red':error.detail_error}">
                Request Detail
                <span v-if="error.detail_error">-- Detail Cannot be empty</span>
              </label>
              <div class="box" :class="{'box-danger': error.detail_error}">
                <div class="box-body">
                  <textarea id="editor" name="editor" style="width: 100%"></textarea>
                </div>
              </div>

              <br>

              <!-- Client information -->
              <div class="box box-primary collapsed-box">
                <div class="box-header with-border">
                  <a class="box-title pointer" data-widget="collapse">
                    <i class="fa fa-user"></i>&nbsp;&nbsp;Client Information
                  </a>
                  <!-- /.box-tools -->
                </div>
                <!-- /.box-header -->
                <div class="box-body" style="display:none;">
                  <div class="form-group">
                    <label>First Name</label>
                    <input readonly class="form-control capitalize" :value="requester.first_name">
                  </div>
                  <div class="form-group">
                    <label>Middle Initial</label>
                    <input readonly class="form-control capitalize" :value="requester.mid_initial">
                  </div>
                  <div class="form-group">
                    <label>Last Name</label>
                    <input readonly class="form-control capitalize" :value="requester.last_name">
                  </div>
                  <div class="form-group">
                    <label>Email</label>
                    <input readonly class="form-control" :value="requester.email">
                  </div>
                  <!-- /input-group -->
                </div>
                <!-- /.box-body -->
              </div>

              <!-- Submit button -->
              <button class="btn btn-primary btn-lg">
                <i class="fa fa-paper-plane"></i>&nbsp;&nbsp;Submit
              </button>
            </div>
          </form>
        </div>
        <div class="col-md-4">
          <div class="box-header" style="color:gray">
            <label>
              <i class="fa fa-info"></i>&nbsp;&nbsp;Tips
            </label>
          </div>
          <div class="box-body" style="color:gray">
            <ul>
              <li>Request title and request detail are required.</li>
              <li>Request client and admins will recieve a notification after the request is created.</li>
              <li>
                Change request can also submit through Email:
                <i>
                  <b>
                    <a
                      style="color:gray"
                      href="mailto:submit-request@rsicrt.com"
                    >submit-request@rsicrt.com</a>
                  </b>
                </i>
                <br>
              </li>
              <li>
                The subject of email will be used as change request
                <i>title</i>, and the body will be used as change request
                <i>detail</i>.
              </li>
              <li>
                <i>Admin</i> are able to file a change request on behalf of client.
              </li>
              <li>Client information can be view by click "Client Information" tab.</li>
              <li>After click submit, filer need to confirm the action by check "Action Acknowledged" checkbox then click confirm button.</li>
            </ul>
            <div style="padding-top:100px; overflow:hidden;">
              <div class="sk-folding-cube">
                <div class="sk-cube1 sk-cube"></div>
                <div class="sk-cube2 sk-cube"></div>
                <div class="sk-cube4 sk-cube"></div>
                <div class="sk-cube3 sk-cube"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex';
import HTTP from '@/http';
import router from '@/router';
import UserSearch from '@/components/UserSearch';

export default {
  components: {
    UserSearch
  },
  computed: {
    ...mapState('userStore', ['user']),
    ...mapState('crStore', ['requestData', 'error']),
    ...mapGetters('userStore', ['isAdmin'])
  },

  data() {
    return {
      editor: null,
      clientList: null,
      requester: {}
    };
  },

  mounted() {
    var self = this;
    if (this.isAdmin) {
      this.setRequesterData(this.requestData.client);
    } else {
      this.requester = this.user;
    }

    //initialize editor
    ClassicEditor.create(document.querySelector('#editor'))
      .then(editor => {
        self.editor = editor;
        editor.setData(self.requestData.details);
        // clear detail error when blur
        editor.ui.focusTracker.on(
          'change:isFocused',
          (evt, name, isFocused) => {
            if (!isFocused) {
              self.clearError('detail');
            }
          }
        );
        // bind request detail to editor data
        editor.model.document.on('change', () => {
          self.setDetail(editor.getData());
        });
      })
      .catch(e => self.setGlobalError(e));

    //initialize collapse box
    $('.collapsed-box').boxWidget({
      animationSpeed: 300,
      collapseTrigger: "[data-widget='collapse']"
    });
  },

  methods: {
    ...mapActions('errorStore', ['setGlobalError']),
    ...mapActions('userStore', ['fetchNavMenu']),
    ...mapMutations('crStore', [
      'setTitle',
      'setDetail',
      'setError',
      'clearError',
      'clearAll',
      'setMessage',
      'setClient'
    ]),

    userChange(val) {
      this.clearError('client');
      this.setClient(val);
      this.setRequesterData(val);
    },

    setRequesterData(val) {
      try {
        //set requester data
        val = val.split(' ');
        this.requester = {
          first_name: val[0],
          mid_initial: val[1],
          last_name: val[2],
          email: val[3].substring(1, val[3].length - 1)
        };
      } catch (e) {
        //set empty requester if selected val is empty
        this.requester = {};
      }
    },

    clearAllData() {
      this.clearAll();
      this.editor.setData('');
      if (this.$refs.usersearch) {
        this.$refs.usersearch.clear();
      }
    },

    //submit request
    submitRequest() {
      var validFail = false;
      // Editor will give <p>&nbsp;</p> when empty
      // notify error if detail or title is empty
      if (
        !this.requestData.details ||
        this.requestData.details === '<p>&nbsp;</p>'
      ) {
        this.setError('detail');
        validFail = true;
      }
      if (!this.requestData.title) {
        this.setError('title');
        validFail = true;
      }

      //if current user is admin or dev, give error if select client is empty
      if (this.isAdmin && !this.requestData.client) {
        this.setError('client');
        validFail = true;
      }

      if (validFail) return;

      //show dialog if both field has been populated
      this.showDialog();
    },

    showDialog() {
      this.$modal.show('dialog', {
        title: `<i class='fa fa-envelope'></i> Change Request Confirmation`,
        maxWidth: 300,
        template: this.getConfirmTemplate(this.requester),

        buttons: [
          {
            title: 'Confirm',
            handler: spinner => {
              //if acknowledge checkbox is checked, perform post request, else display error
              if (!$('.acknowledge-ck').is(':checked')) {
                $('.acknowledge-ck')
                  .parent()
                  .addClass('text-red');
              } else {
                this.setMessage($('.request-message').val());
                this.setClient(this.requester.email);
                spinner.loading = true;
                //verify and post change request
                HTTP()
                  .post(`/change-request`, this.requestData)
                  .then(({ data }) => {
                    //if return data not exist, push for error
                    if (!data) {
                      $('.dialog-error').text('Something is wrong');
                    } else {
                      this.fetchNavMenu('notification');
                      this.clearAllData();
                      this.$modal.hide('dialog');
                      router.push(`/change-request/${data.id}/content`);
                    }
                  })
                  .catch(e => {
                    this.setGlobalError(e);
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

    //confirm dialog template
    getConfirmTemplate(user) {
      var template = `<label>Requester Name</label>
          <p class='capitalize'>${user.first_name} ${user.mid_initial} ${
        user.last_name
      }</p>
          <label>Requester Email</label>
          <p>${user.email}</p>
          <label>
            Message
          </label><br>
           <textarea class='request-message' style="width:100%;" rows="5" placeholder="optional..."></textarea>
          <hr>
          <label>
            <input class='acknowledge-ck' type='checkbox'> 
            &nbsp;Action Acknowledged - Required
          </label>
          `;

      return template;
    }
  }
};
</script>

<style>
</style>
