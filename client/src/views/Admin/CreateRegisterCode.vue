<!--
 - @author: Wei Zheng
 - @description: generate registration code for user.
 -->

<template>
  <div>
    <section class="content-header">
      <h1>
        <i class="fa fa-user-plus"></i>&nbsp;&nbsp;Registration Code Form
      </h1>
    </section>
    <section class="content">
      <div class="row">
        <div class="col-md-8">
          <form class="box" @submit.prevent="generateRegisterCode">
            <div class="box-body form-background">
              <span class="pull-right">
                <a
                  class="register-resetbtn btn btn-social-icon"
                  @click.prevent="resetCodeData"
                  data-toggle="tooltip"
                  title="Reset All"
                >
                  <i class="fa fa-repeat"></i>
                </a>
              </span>
              <br>
              <!-- Email input -->
              <label :class="{'text-red':error.email_error}">Receiver/User Email Address</label>
              <div class="input-group" :class="{'has-error':error.email_error}">
                <span class="input-group-addon">
                  <i class="fa fa-envelope"></i>
                </span>
                <input
                  type="email"
                  class="form-control"
                  v-model="codeData.email"
                  placeholder="example@domain.com"
                  @blur="clearError('email')"
                >
              </div>
              <span
                class="help-block"
                :class="{'text-red':error.email_error}"
              >&nbsp;{{error.email_error}}</span>

              <!-- Message Input -->
              <label>Message</label>
              <div class="box">
                <div class="box-body">
                  <textarea id="editor" name="editor" style="width: 100%"></textarea>
                </div>
              </div>
              <br>

              <!-- Regsiter information -->
              <div
                class="box box-primary collapsed-box"
                :style="[(error.first_name_error||error.last_name_error)?{'border-top-color': '#f56954'}:{'border-top-color': '#3c8dbc'}]"
              >
                <div class="box-header with-border">
                  <a
                    class="box-title"
                    data-widget="collapse"
                    :class="{'text-red':error.first_name_error||error.last_name_error}"
                  >
                    <i class="fa fa-user"></i>&nbsp;&nbsp;Register Info
                    <span v-if="!codeData.allowEdit">- Must!</span>
                  </a>
                  
                  <a class="box-tools pull-right">
                    <button
                      type="button"
                      class="btn btn-box-tool"
                      data-toggle="tooltip"
                      title="Registor's Ability To Edit Information."
                      @click="allowEditClick"
                    >
                      User Editable&nbsp;&nbsp;
                      <i :class="getEditCondition()"></i>
                    </button>
                  </a>
                  <!-- /.box-tools -->
                </div>
                <!-- /.box-header -->
                <div class="box-body" style="display:none;">
                  <div class="form-group" :class="{'has-error':error.first_name_error}">
                    <label>First Name</label>
                    
                    <input
                      v-model="codeData.first_name"
                      class="form-control"
                      placeholder="F."
                      @blur="clearError('first_name')"
                    >
                    <span class="help-block">{{error.first_name_error}}</span>
                  </div>
                  <div class="form-group">
                    <label>Middle Initial</label>
                    <input v-model="codeData.mid_initial" class="form-control" placeholder="M.">
                  </div>
                  <div class="form-group" :class="{'has-error':error.last_name_error}">
                    <label>Last Name</label>
                    <input
                      v-model="codeData.last_name"
                      class="form-control"
                      placeholder="L."
                      @blur="clearError('last_name')"
                    >
                    <span class="help-block">{{error.last_name_error}}</span>
                  </div>
                  <div class="form-group">
                    <label>Role</label>
                    <select class="form-control" id="code-role" @change="changeRole">
                      <option>Client</option>
                      <option>Admin</option>
                      <option>Developer</option>
                    </select>
                  </div>
                </div>

                <!-- Submit button -->
              </div>
              <button class="btn btn-primary btn-lg">
                <i class="fa fa-paper-plane"></i>&nbsp;&nbsp;Generate
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
              <li>Receiver email is required.</li>
              <li>
                Register Information will be require only if "User Ediable" is set to
                <i
                  class="fa fa-minus-square"
                ></i>.
              </li>
              <li>
                Role can be assigned under Requester Info. The default role is
                <i>client</i>
              </li>
              <li>Information of code user can be preset by click "Register Info" tab.</li>
              <li>"User Ediable" option allow/forbidden code user to edit the preset information.</li>
              <li>A E-Mail will automatically send to the code user.</li>
              <li>Please inform the code user to check junk mail box.</li>
            </ul>
            <div style="width:100%; height:200px; margin-top:120px;">
              <div class="square-animate"></div>
              <div class="square-shadow"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import HTTP from '@/http';
import router from '@/router';

export default {
  mounted() {
    var self = this;
    //initialize editor
    ClassicEditor.create(document.querySelector('#editor'))
      .then(editor => {
        self.editor = editor;
        // bind code contetn to editor data
        editor.model.document.on('change', () => {
          self.codeData.content = editor.getData();
        });
      })
      .catch(e => self.setGlobalError(e));

    //initialize collapse box
    $('.collapsed-box').boxWidget({
      animationSpeed: 300,
      collapseTrigger: "[data-widget='collapse']"
    });
  },

  computed: {
    ...mapState('userStore', ['user'])
  },

  data() {
    return {
      codeData: {
        first_name: null,
        mid_initial: null,
        last_name: null,
        email: null,
        allowEdit: true,
        content: null,
        role: 'Client'
      },
      error: {
        first_name_error: null,
        last_name_error: null,
        email_error: null
      },
      editor: null
    };
  },

  methods: {
    ...mapActions('errorStore', ['setGlobalError']),
    ...mapActions('userStore', ['fetchNavMenu']),

    changeRole() {
      this.codeData.role = $('#code-role option:selected').text();
    },

    //submit code data and perform http request
    generateRegisterCode() {
      var dialogTitle, dialogBtnText, dialogContent;

      HTTP()
        .post(`/regist-code`, this.codeData)
        .then(({ data }) => {
          //request is successful if data.code exist
          if (data.code) {
            this.showDialog(
              "<span class='text-green'><i class='fa fa-check'></i> SUCCESS! </span>",
              'Got It!',
              `Your registration code is <b>${data.code}</b>,
             and the code is automatically sent to <i>${
               this.codeData.email
             }.</i>`
            );
            this.resetCodeData();
            //update notification
            this.fetchNavMenu('notification');
          } else {
            this.setErrorMessage(data);
            this.showDialog(
              "<span class='text-red'><i class='fa fa-window-close'></i> Oops! </span>",
              'Ok',
              "<h4 style='text-align:center'>There are some fields need to be fix</h4>"
            );
          }
        })
        .catch(e => {
          this.setGlobalError(e);
        });
    },

    showDialog(dialogTitle, dialogBtnText, dialogContent) {
      this.$modal.show('dialog', {
        title: dialogTitle,
        template: dialogContent,
        buttons: [
          {
            title: dialogBtnText,
            default: true
          }
        ]
      });
    },

    //toggle allowEdit value
    allowEditClick() {
      this.codeData.allowEdit = !this.codeData.allowEdit;
    },

    //return css class
    getEditCondition() {
      return this.codeData.allowEdit
        ? 'fa fa-check-square text-green'
        : 'fa  fa-minus-square text-red';
    },

    // loop through all exception error then set message to the associated field
    setErrorMessage(exceptionArr) {
      exceptionArr.forEach(({ field, message }) => {
        this.error[field + '_error'] = message;
      });
    },

    //clear selector's error message
    clearError(selector) {
      this.error[selector + '_error'] = null;
    },

    resetCodeData() {
      this.codeData = {
        first_name: null,
        mid_initial: null,
        last_name: null,
        email: null,
        allowEdit: true,
        content: null,
        role: 'Client'
      };
      this.error = {
        first_name_error: null,
        last_name_error: null,
        email_error: null
      };
      this.editor.setData('');
      $('#code-role').val('Client');
    }
  }
};
</script>

<style>
.ck-editor__editable {
  height: 250px;
}
</style>
