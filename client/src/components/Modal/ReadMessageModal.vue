<template>
  <modal
    name="read-msg"
    :adaptive="true"
    :classes="['v--modal', 'box', 'box-primary' , 'vue-dialog']"
    width="90%"
    height="90%"
    :max-width="1100"
    :pivot-y="0.3"
    transition="slide-down"
    @before-open="getParams"
  >
    <div class="box box-primary" style="margin:0; height:100%;">
      <div class="box-header with-border">
        <h3 class="box-title">
          <i class="fa fa-envelope"></i>
          &nbsp;&nbsp;{{isReceiver?'Read Mail':'Sent Mail'}}
        </h3>

        <div class="box-tools pull-right">
          <a v-if="isReceiver" @click="toggleBookmark" class="btn btn-box-tool">
            <i class="fa text-yellow" :class="isBookmark?'fa-star':'fa-star-o'"></i>
          </a>
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
            {{isReceiver? 'From' : 'Receiver'}}: {{isReceiver? params.senderName : params.receiverEmail}}
            <span
              class="mailbox-read-time pull-right"
            >{{formatDate(params.created_at)}}</span>
          </h5>
        </div>
        <!-- /.mailbox-read-info -->
        <div class="mailbox-controls with-border text-center">
          <div class="btn-group">
            <button type="button" class="btn btn-default btn-sm" @click="replyMSG(params)">
              <i class="fa fa-reply"></i> Reply
            </button>
            <button type="button" class="btn btn-default btn-sm" @click="forwardMSG(params)">
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
      params: {},
      isBookmark: 0
    };
  },

  computed: {
    //verfy if the user is the receiver
    isReceiver() {
      return (
        this.$store.getters['userStore/email'] === this.params.receiverEmail
      );
    }
  },

  methods: {
    //get initiate params. {senderEmail, title, content, receiverEmail, receiverName, created_at}
    getParams(event) {
      if (event) {
        this.params = event.params;
        this.isBookmark = this.params.isBookmark;
        //mark read if msg is not read
        if (this.isReceiver && !this.params.isRead) {
          HTTP()
            .put(`message/${this.params.id}`, { isRead: true })
            .then(() => {
              // update user message menu
              this.$store.dispatch('userStore/fetchNavMenu', 'msg');
              // update mailbox
              this.$store.commit('userStore/refreshMailbox', {
                id: this.params.id,
                isRead: 1
              });
            })
            .catch(e => {
              this.$store.dispatch('errorStore/setGlobalError', e);
            });
        }
      }
    },

    // toggle message bookmark
    toggleBookmark() {
      if (this.isReceiver) {
        this.isBookmark = this.isBookmark === 0 ? 1 : 0;
        // update the server
        HTTP()
          .put(`message/${this.params.id}`, { isBookmark: this.isBookmark })
          .then(() => {
            this.$store.dispatch('userStore/fetchNavMenu', 'msg');
            //update mailbox
            this.$store.commit('userStore/refreshMailbox', {
              id: this.params.id,
              isBookmark: this.isBookmark
            });
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
