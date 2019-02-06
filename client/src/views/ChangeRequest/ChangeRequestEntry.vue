<template>
  <div>
    <section class="content-header">
      <h1>
        <i class="fa fa-edit"></i>&nbsp;&nbsp;Change Request Entry
      </h1>
    </section>
    <section class="content">
      <div class="box">
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

          <!-- Title input  -->
          <label :class="{'text-red':error.title_error}">
            Request Title
            <span v-if="error.title_error">-- Title Cannot be empty</span>
          </label>
          <div class="input-group" :class="{'has-error':error.title_error}">
            <span class="input-group-addon">
              <i class="fa fa-info-circle"></i>
            </span>
            <input class="form-control" @blur="clearError('title')" :value="requestData.title" @input="setTitle">
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

          <!-- Requester information -->
          <div class="box box-primary collapsed-box">
            <div class="box-header with-border">
              <a class="box-title pointer" data-widget="collapse">
                <i class="fa fa-user"></i>&nbsp;&nbsp;Requester Information
              </a>
              <!-- /.box-tools -->
            </div>
            <!-- /.box-header -->
            <div class="box-body" style="display:none;">
              <div class="form-group">
                <label>Full Name</label>
                <input
                  readonly
                  class="form-control capitalize"
                  :value="`${user.first_name} ${user.mid_initial} ${user.last_name}`"
                >
              </div>
              <div class="form-group">
                <label>Email</label>
                <input readonly class="form-control" :value="user.email">
              </div>
              <div class="form-group">
                <label>Role</label>
                <input readonly class="form-control" :value="user.role">
              </div>
              <!-- /input-group -->
            </div>
            <!-- /.box-body -->
          </div>

          <!-- Submit button -->
          <button class="btn btn-primary btn-lg" @click="submitRequest">
            <i class="fa fa-paper-plane"></i>&nbsp;&nbsp;Submit
          </button>
        </div>
      </div>
    </section>
    
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import HTTP from "@/http";
import router from "@/router";

export default {
  mounted() {
    var self = this;

    //initialize editor
    ClassicEditor.create(document.querySelector("#editor"))
      .then(editor => {
        self.editor = editor;
        editor.setData(self.requestData.details);
        // clear detail error when blur
        editor.ui.focusTracker.on(
          "change:isFocused",
          (evt, name, isFocused) => {
            if (!isFocused) {
              self.clearError('detail');
            }
          }
        );
        // bind request detail to editor data
        editor.model.document.on("change", () => {
          self.setDetail(editor.getData());
        });
      })
      .catch(e => self.setGlobalError(e));

    //initialize collapse box
    $(".collapsed-box").boxWidget({
      animationSpeed: 500,
      collapseTrigger: "[data-widget='collapse']"
    });
  },

  computed: {
    ...mapState("authentication", ["user"]),
    ...mapState("changeRequest", ["requestData", "error"])
  },

  data() {
    return {

      editor: null
    };
  },

  methods: {
    ...mapActions("errorStore", ["setGlobalError"]),
    ...mapMutations("changeRequest",["setTitle","setDetail","setError","clearError","clearAll","setMessage"]),

    clearAllData(){
      this.clearAll();
      this.editor.setData("");
    },

    //submit request
    submitRequest() {
      var validFail = false;
      // Editor will give <p>&nbsp;</p> when empty
      if (
        !this.requestData.details ||
        this.requestData.details === "<p>&nbsp;</p>"
      ) {
        this.setError("detail");
        validFail=true;
      }
      if (!this.requestData.title) {
        this.setError("title");
        validFail=true;
      }

      if(validFail) return;
      //show dialog if both field has been populated
      this.showDialog();
    },

    showDialog() {
      this.$modal.show("dialog", {
        title: `<i class='fa fa-envelope'></i> Change Request Confirmation`,
        maxWidth: 300,
        template: this.getConfirmTemplate(this.user),

        buttons: [
          {
            title: "Confirm",
            handler: spinner => {
              //if acknowledge checkbox is checked, perform post request, else display error
              if (!$(".acknowledge-ck").is(":checked")) {
                $(".acknowledge-ck")
                  .parent()
                  .addClass("text-red");
              } else {
                this.setMessage($('.request-message').val());
                spinner.loading = true;
                //verify and post change request
                HTTP()
                  .post(`/change-request`, this.requestData)
                  .then(({ data }) => {
                    //if return data not exist, push for error
                    if (!data) {
                      $(".dialog-error").text("Something is wrong");
                    } else {             
                      this.clearAllData();
                      this.$modal.hide("dialog");
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
            title: "Cancel"
          }
        ]
      });
    },

    //confirm dialog template
    getConfirmTemplate(user) {
      var template = `<label>User Name</label>
          <p class='capitalize'>${user.first_name} ${user.mid_initial || ""} ${
        user.last_name
      }</p>
          <label>User Email</label>
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
.ck-editor__editable {
  height: 250px;
}
</style>
