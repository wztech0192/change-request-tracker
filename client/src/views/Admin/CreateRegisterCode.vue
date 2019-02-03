<template>
  <div>
    <section class="content-header">
      <h1>
        <i class="fa fa-user-plus"></i>&nbsp;&nbsp;Registration Code Generator
      </h1>
    </section>
    <section class="content">
      <div class="box">
        <div class="box-body" style="background-color:lightgrey">
          <span class="pull-right">
            <a
              class="register-resetbtn btn btn-social-icon"
              @click.prevent="resetCodeData"
              data-toggle="tooltip"
              title="Reset All Except Message"
            >
              <i class="fa fa-repeat"></i>
            </a>
          </span>
          <br>
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
          <label>Message</label>
          <div class="box">
            <div class="box-body">
              <form>
                <textarea
                  id="wysihtml5-textarea"
                  style="width: 100%; height: 200px; font-size: 14px; line-height: 18px; border: 1px solid rgb(221, 221, 221); padding: 10px; "
                  placeholder="Place some text here"
                ></textarea>
              </form>
            </div>
          </div>
          <hr>
          <br>
          <div
            class="box box-primary collapsed-box"
            :class="{'box-danger':error.first_name_error||error.last_name_error}"
          >
            <div class="box-header with-border">
              <span class="box-title pointer" data-widget="collapse">
                <i class="fa fa-user"></i>&nbsp;&nbsp;User Registration Information
                <span
                  v-if="!codeData.allowEdit"
                >-- Must Fill!</span>
              </span>
              
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
                <span class="help-block">&nbsp;{{error.first_name_error}}</span>
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
                <span class="help-block">&nbsp;{{error.last_name_error}}</span>
              </div>

              <!-- /input-group -->
            </div>
            <!-- /.box-body -->
          </div>
          <button class="btn btn-primary btn-lg" @click="generateRegisterCode">
            <i class="fa fa-paper-plane"></i>&nbsp;&nbsp;Generate
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import HTTP from "@/http";
import router from "@/router";

export default {
  mounted() {
    //verify user's role
    if (this.user.role !== "Admin" && this.user.role !== "Developer") {
      router.push("/");
      this.setGlobalError("Only admin allows to enter this page");
    } else {
      //initialize editor
      $("#wysihtml5-textarea").wysihtml5();

      //initialize collapse box
      $(".collapsed-box").boxWidget({
        animationSpeed: 500,
        collapseTrigger: "[data-widget='collapse']"
      });
    }
  },

  computed: {
    ...mapState("authentication", ["user"])
  },

  data() {
    return {
      codeData: {
        first_name: null,
        mid_initial: null,
        last_name: null,
        email: null,
        allowEdit: true
      },
      error: {
        first_name_error: null,
        last_name_error: null,
        email_error: null
      }
    };
  },

  watch: {
    message() {
      consoel.log(this.message);
    }
  },

  methods: {
    ...mapActions("errorStore", ["setGlobalError"]),
    //submit code data and perform http request
    generateRegisterCode() {
      this.codeData.content = $("#wysihtml5-textarea").val();
      var dialogTitle = "hi",
        dialogBtnText,
        dialogContent;

      HTTP()
        .post(`/regist-code`, this.codeData)
        .then(({ data }) => {
          //request is successful if data.code exist
          if (data.code) {
            this.showDialog(
              "<span class='text-green'><i class='fa fa-check'></i> SUCCESS! </span>",
              "Got It!",
              `Your registration code is <b>${data.code}</b>,
             and the code is automatically sent to <i>${
               this.codeData.email
             }.</i>`
            );
            router.push("/user-list");
          } else {
            this.setErrorMessage(data);
            this.showDialog(
              "<span class='text-red'><i class='fa fa-window-close'></i> Oops! </span>",
              "Ok",
              "<h4 style='text-align:center'>There are some fields need to be fix</h4>"
            );
          }
        })
        .catch(e => {
          this.setGlobalError(e);
        });
    },

    showDialog(dialogTitle, dialogBtnText, dialogContent) {
      this.$modal.show("dialog", {
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
        ? "fa fa-check-square text-green"
        : "fa  fa-minus-square text-red";
    },

    // loop through all exception error then set message to the associated field
    setErrorMessage(exceptionArr) {
      exceptionArr.forEach(({ field, message }) => {
        this.error[field + "_error"] = message;
      });
    },

    //clear selector's error message
    clearError(selector) {
      this.error[selector + "_error"] = null;
    },

    resetCodeData() {
      this.codeData = {
        first_name: null,
        mid_initial: null,
        last_name: null,
        email: null,
        allowEdit: true
      };
      this.error = {
        first_name_error: null,
        last_name_error: null,
        email_error: null
      };
    }
  }
};
</script>

<style>
</style>
