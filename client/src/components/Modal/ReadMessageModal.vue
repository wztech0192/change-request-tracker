<template>
  <modal
    name="read-msg"
    :adaptive="true"
    :classes="['v--modal', 'box', 'box-primary' , 'vue-dialog']"
    width="90%"
    height="90%"
    :max-width="1100"
    :pivot-y="0.3"
    transition="fade"
    @before-open="getParams"
    @opened="$emit('opened', $event)"
  >
    <div class="box box-primary" style="margin:0; height:100%;">
      <div class="box-header with-border">
        <h3 class="box-title">
          <i class="fa fa-envelope"></i>&nbsp;&nbsp;Read Mail
        </h3>

        <div class="box-tools pull-right">
          <a @click="$modal.hide('read-msg')" class="btn btn-box-tool">
            <i class="fa fa-close"></i>
          </a>
        </div>
      </div>
      <!-- /.box-header -->
      <div class="box-body no-padding">
        <div class="mailbox-read-info">
          <h3>{{params.title}}</h3>
          <h5>
            From: {{params.senderName}}
            <span class="mailbox-read-time pull-right">{{getDate()}}</span>
          </h5>
        </div>
        <!-- /.mailbox-read-info -->
        <div class="mailbox-controls with-border text-center">
          <div class="btn-group">
            <button type="button" class="btn btn-default" @click="replyMSG(params)">
              <i class="fa fa-reply"></i> Reply
            </button>
            <button type="button" class="btn btn-default" @click="forwardMSG(params)">
              <i class="fa fa-share"></i> Forward
            </button>
          </div>
          <!-- /.btn-group -->
        </div>
        <!-- /.mailbox-controls -->
        <div class="mailbox-read-message" v-html="params.content"></div>
        <!-- /.mailbox-read-message -->
      </div>

      <!-- /.box-footer -->
    </div>
  </modal>
</template>

<script>
import helper from '@/mixin/helper.js';
import HTTP from '@/http';
export default {
  mixins: [helper],
  data() {
    return {
      params: {}
    };
  },

  methods: {
    //calculate the message sending date
    getDate() {
      const date = new Date(this.params.created_at);
      let dateString = date.toDateString().split(' ');
      const formatedDateString =
        dateString[2] + ' ' + dateString[1] + ', ' + dateString[3];
      return formatedDateString + ' ' + date.toLocaleTimeString();
    },

    //get initiate params. {senderEmail, title, content, receiverEmail, receiverName, created_at}
    getParams(event) {
      if (event) {
        this.params = event.params;
      }

      //mark read if msg is not read
      if (!this.params.isRead) {
        HTTP()
          .patch(`message/${this.params.id}`, { isRead: true })
          .then(() => {
            // update user message menu
            this.$store.dispatch('userStore/fetchNavMenu', 'msg');
          })
          .catch(e => {
            this.$store.dispatch('errorStore/setGlobalError', e);
          });
      }
    }
  }
};
</script>

<style>
</style>
