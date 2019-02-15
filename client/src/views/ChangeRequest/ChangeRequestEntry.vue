<template>
  <div>
    <section class="content-header">
      <h1>
        <i class="fa fa-edit"></i>&nbsp;&nbsp;Change Request Entry
      </h1>
    </section>
    <section class="content">
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
              
              <select class="form-control select2" id="clientselect" style="width: 100%;">
                <option
                  v-for="(client, i) in clientList"
                  :value="i"
                >{{client.first_name}} {{client.mid_initial}} {{client.last_name}} ({{client.email}})</option>
              </select>
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
    </section>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from "vuex";
import HTTP from "@/http";
import router from "@/router";

export default {
  created() {
 
  },
  mounted() {
    var self = this;
    if (this.isAdmin) {
      //populate client dropdown box
      this.fetchClientList();
    } else {
      this.requester = this.user;
    }
    
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
              self.clearError("detail");
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
    ...mapState("changeRequest", ["requestData", "error"]),
    ...mapGetters("authentication", ["isAdmin"])
  },

  data() {
    return {
      editor: null,
      clientList: null,
      requester: {}
    };
  },

  methods: {
    ...mapActions("errorStore", ["setGlobalError"]),
    ...mapMutations("changeRequest", [
      "setTitle",
      "setDetail",
      "setError",
      "clearError",
      "clearAll",
      "setMessage",
      "setClient"
    ]),

    //fetch client list if user is admin or developer
    fetchClientList() {
      var self = this;
      HTTP()
        .get("/user/by-role/Client")
        .then(({ data }) => {
          //if return data not exist, push for error
          if (!data) {
            this.setGlobalError("Something is wrong");
          } else {
            this.clientList = data;
            //initalize dropdown box
            $(".select2").select2({
              placeholder: "Select a client"
            });

            //initialize select
            setTimeout(() => {
              if (self.requestData.client) {
                self.requester = self.clientList[self.requestData.client];
              }
              $("#clientselect")
                .val(self.requestData.client)
                .trigger("change");
              //select event
              $("#clientselect").on("select2:select", function(e) {
                self.clearError("client");
                var index = e.params.data.id;
                self.setClient(index);
                self.requester = index ? self.clientList[index] : {};
              });
            }, 10);
          }
        })
        .catch(e => {
          this.setGlobalError(e);
        });
    },

    clearAllData() {
      this.clearAll();
      this.editor.setData("");
      $("#clientselect")
        .val("")
        .trigger("change");
    },

    //submit request
    submitRequest() {
      var validFail = false;
      // Editor will give <p>&nbsp;</p> when empty
      // notify error if detail or title is empty
      if (
        !this.requestData.details ||
        this.requestData.details === "<p>&nbsp;</p>"
      ) {
        this.setError("detail");
        validFail = true;
      }
      if (!this.requestData.title) {
        this.setError("title");
        validFail = true;
      }

      //if current user is admin or dev, give error if select client is empty
      if (this.isAdmin && !this.requestData.client) {
        this.setError("client");
        validFail = true;
      }

      if (validFail) return;

      //show dialog if both field has been populated
      this.showDialog();
    },

    showDialog() {
      this.$modal.show("dialog", {
        title: `<i class='fa fa-envelope'></i> Change Request Confirmation`,
        maxWidth: 300,
        template: this.getConfirmTemplate(this.requester),

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
                this.setMessage($(".request-message").val());
                this.setClient(this.requester.id);
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
            title: "Cancel"
          }
        ]
      });
    },

    //confirm dialog template
    getConfirmTemplate(user) {
      var template = `<label>Requester Name</label>
          <p class='capitalize'>${user.first_name} ${user.mid_initial || ""} ${
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
.ck-editor__editable {
  height: 250px;
}
</style>
