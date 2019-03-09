<!--
 - @author: Wei Zheng
 - @description: display or submit change request message. Allow real-time chatting.
 -->


<template>
  <div class="box box-comments" style="box-shadow:0px 0px 5px grey;">
    <div v-if="!msgList || msgList.length<=0">
      <h3 style="text-align:center;">There is no message</h3>
    </div>
    <div id="cr-msg">
      <transition-group name="list" tag="div">
        <div
          v-for="msg in msgList"
          :key="msg.id"
          class="box-footer box-comment"
          style="padding:10px; "
        >
          <!-- User image -->
          <Avator class="img-circle img-sm" :fullName="msg.senderName"/>
          <div class="comment-text">
            <span class="username">
              {{msg.senderName}}
              <span class="text-muted pull-right">{{formatTime(msg.created_at)}}</span>
            </span>
            <!-- /.username -->
            <div v-html="msg.content"></div>
          </div>
          <!-- /.comment-text -->
          <br>
        </div>
      </transition-group>
    </div>
    <div>
      <textarea id="editor" name="editor" style="width: 100%;"></textarea>
      
      <button class="btn btn-primary btn-lg" style="width:100%;" @click="sendMsg">
        <i class="fa fa-share-square"></i> Send
      </button>
    </div>

    <!-- /.box-comment -->
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';
import HTTP from '@/http';
import router from '@/router';
import Avator from '@/components/_Main/Avator';
export default {
  data() {
    return {
      msgList: null,
      editor: null,
      newMsg: null,
      msgNum: 20,
      refresher: null
    };
  },

  components: {
    Avator
  },

  props: {
    // refresh value
    refresh: Number,
    //calculate time elapsed
    calculateTimeElapsed: Function
  },

  watch: {
    //update when refresh value change
    refresh() {
      this.fetchRequestMsg();
    }
  },

  created() {
    this.setTab('message');
    var self = this;
    this.fetchRequestMsg(this.msgNum);
  },

  mounted() {
    var self = this;
    //initialize editor
    ClassicEditor.create(document.querySelector('#editor'), {
      toolbar: [
        'bold',
        'italic',
        'link',
        'bulletedList',
        'numberedList',
        'blockQuote',
        'undo',
        'redo'
      ]
    })
      .then(editor => {
        self.editor = editor;
        // bind request detail to editor data
        editor.model.document.on('change', () => {
          self.newMsg = editor.getData();
        });
      })
      .catch(e => self.setGlobalError(e));

    //add five etra message whenever user scoll to the top.
    $('#cr-msg').on('scroll', function() {
      if ($(this).scrollTop() === 0) {
        self.fetchRequestMsg((self.msgNum += 5));
      }
    });
  },

  watch: {
    msgList() {
      var el = $('#cr-msg');
      //perform a scroll to if the current position is bottom and messageList change
      if (el.scrollTop() >= el[0].scrollHeight - el.outerHeight() - 10) {
        this.scrollDown();
      }
    }
  },

  methods: {
    ...mapActions('errorStore', ['setGlobalError']),
    ...mapMutations('crStore', ['setTab']),

    //fetch request message
    fetchRequestMsg(num, scroll) {
      return HTTP()
        .get(`/change-request/${this.$route.params.id}/msg/${num}`)
        .then(({ data }) => {
          this.msgList = data.reverse();
        })
        .catch(e => {
          this.setGlobalError(e);
        });
    },

    //scroll to the bottom of the message box
    scrollDown() {
      setTimeout(() => {
        $('#cr-msg').scrollTop($('#cr-msg')[0].scrollHeight);
      }, 20);
    },

    //http request to post new message
    sendMsg() {
      // block empty message
      if (
        this.newMsg &&
        this.newMsg !== '' &&
        this.newMsg !== '<p>&nbsp;</p>'
      ) {
        return HTTP()
          .post(`/change-request/${this.$route.params.id}/msg`, {
            content: this.newMsg
          })
          .then(({ data }) => {
            this.editor.setData('');
            this.fetchRequestMsg(this.msgNum, true);
          })
          .catch(e => {
            this.setGlobalError(e);
          });
      }
    },

    //calculate duration
    formatTime(date) {
      var now = new Date();
      var time;
      // if msg date is today, display hour AM/PM, else display days.
      if (parseInt(date[8] + date[9]) !== now.getDate()) {
        time = this.calculateTimeElapsed(date, [
          ' minutes ago',
          ' hours ago',
          ' days ago'
        ]);
      } else {
        //convert 24 hour to 12 hour + AM/PN
        var hour = date.split(' ')[1];
        hour = hour.substring(0, 5);
        var head = hour[0] + hour[1];
        if (head >= 12) {
          hour = head - 12 + hour.substring(2, 6);
          hour += ' PM';
        } else {
          hour += ' AM';
        }
        time = hour + ' Today';
      }
      return time;
    }
  }
};
</script>

<style>
#cr-msg {
  max-height: 75vh;
  overflow: auto;
}
</style>
