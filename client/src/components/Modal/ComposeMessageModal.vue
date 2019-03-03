<template>
  <modal
    name="compose-msg"
    :adaptive="true"
    height="auto"
    :classes="['v--modal', 'box', 'box-primary' , 'vue-dialog']"
    width="85%"
    :max-width="1000"
    :pivot-y="0.3"
    transition="fade"
    @opened="initModal"
    @before-open="getParams"
  >
    <div class="box-header with-border">
      <h3 class="box-title">
        <i class="fa fa-envelope"></i>&nbsp;&nbsp;Compose New Message
      </h3>
      <div class="box-tools">
        <button type="button" class="btn btn-box-tool" @click="$modal.hide('compose-msg')">
          <i class="fa fa-close"></i>
        </button>
      </div>
    </div>
    <!-- /.box-header -->
    <div class="box-body">
      <div class="form-group">
        <UserSearch
          id="receiver-select2"
          ref="usersearch"
          searchRole="all"
          placeholder="To:"
          :multiple="true"
          :useEmailID="true"
          :onChange="setReceiver"
        ></UserSearch>
      </div>
      <div class="form-group">
        <input class="form-control" placeholder="Subject:" v-model="msgData.title">
      </div>

      <div class="form-group" id="modal_editor">
        <textarea
          ref="compose_editor"
          id="compose_editor"
          name="compose_editor"
          class="form-control"
          style="height: 300px"
        ></textarea>
      </div>
    </div>
    <!-- /.box-body -->
    <div class="box-footer">
      <div class="pull-right">
        <button type="button" class="btn btn-default" @click="$modal.hide('compose-msg')">
          <i class="fa fa-eye-slash"></i> Hide
        </button>
        <button
          type="submit"
          class="btn btn-primary"
          :class="{'disabled':isDisabled()}"
          @click="sendMessage "
        >
          <i class="fa fa-envelope-o"></i> Send
        </button>
      </div>
      <button type="reset" class="btn btn-default" @click="discardMessage">
        <i class="fa fa-times"></i> Discard
      </button>
    </div>
    <!-- /. box -->
    <!-- /.content -->
  </modal>
</template>

<script>
import UserSearch from '@/components/UserSearch';
import HTTP from '@/http';

export default {
  components: {
    UserSearch
  },

  data() {
    return {
      msgData: {
        receiver: null,
        title: null,
        content: null
      }
    };
  },

  methods: {
    //send message
    sendMessage() {
      if (!this.isDisabled()) {
        HTTP()
          .post('message', this.msgData)
          .then(() => {
            //update message menu
            this.$store.dispatch('userStore/fetchNavMenu', 'msg');
            this.$store.commit('userStore/refreshMailbox', { refresh: true });
            this.discardMessage();
          })
          .catch(e => {
            this.$store.dispatch('errorStore/setGlobalError', e);
          });
      }
    },

    // set selected receiver
    setReceiver(val) {
      this.msgData.receiver = val;
    },

    //discard message
    discardMessage() {
      //clear saved msg
      this.msgData = {
        receiver: null,
        title: null,
        content: null
      };

      this.$modal.hide('compose-msg');
    },

    getParams(event) {
      if (event && event.params) {
        if (event.params.receiver) {
          this.msgData.receiver = event.params.receiver;
        }
        if (event.params.title) {
          this.msgData.title = event.params.title;
        }
        if (event.params.content) {
          this.msgData.content = event.params.content;
        }
      }
    },

    initModal() {
      const self = this;

      this.getParams();

      // preset receiver
      if (this.msgData.receiver) {
        let selected = '';
        this.msgData.receiver.forEach(receiver => {
          $('#receiver-select2').append(
            `<option selected='selected' value="${receiver}">${receiver}</option>`
          );
        });
      }

      //  this.msgData.receiver = null;
      //initialize editor

      ClassicEditor.create(self.$refs.compose_editor).then(editor => {
        // self.editor = editor;
        editor.setData(self.msgData.content || '');

        // bind request detail to editor data
        editor.model.document.on('change', () => {
          self.msgData.content = editor.getData();
        });
      });
    },

    //validate if all the required field has been filled
    isDisabled() {
      return (
        this.msgData.title === null ||
        this.msgData.title === '' ||
        this.msgData.receiver === null ||
        this.msgData.receiver.length <= 0 ||
        this.msgData.content === null ||
        this.msgData.content === '<p>&nbsp;</p>'
      );
    }
  }
};
</script>

<style>
#modal_editor .ck-editor__editable {
  height: 50vh !important;
}
</style>
