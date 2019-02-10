<template>
  <div class="box box-comments">
    <div v-if="!msgList || msgList.length<=0">
      <h3 style="text-align:center;">There is no message</h3>
    </div>
    <div id="cr-msg">
      <transition-group name="list" tag="p">
        <div
          v-for="msg in msgList"
          :key="msg.id"
          class="box-footer box-comment"
          style="padding:10px; "
        >
          <!-- User image -->
          <img class="img-circle img-sm" src="@/assets/img/default.jpg" alt="User Image">

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
    <div class="box-footer">
      <textarea id="editor" name="editor" style="width: 100%;"></textarea>
      <button class="btn btn-primary btn-lg" style="width:100%;" @click="sendMsg">
        <i class="fa fa-share-square"></i> Send
      </button>
      <transition name="slide-left" mode="out-in">
        <button class="btn btn-default" style="width:100%;" :key="lock" @click="lock=!lock">{{ lock ? 'Unlock Scroll' : 'Lock Scroll' }}</button>
      </transition>
    </div>

    <!-- /.box-comment -->
  </div>
</template>

<script>
import { mapActions } from "vuex";
import HTTP from "@/http";
import router from "@/router";

export default {
  data() {
    return {
      msgList: null,
      editor: null,
      newMsg: null,
      msgNum: 20,
      refresher: null,
      lock: true
    };
  },

  beforeRouteLeave(to, from, next) {
    //stop interval loop when leaving
    clearInterval(this.refresher);
    next();
  },

  created() {
    var self = this;
    this.fetchRequestMsg(this.msgNum, true);

    //update message each second to newest message
    this.refresher = setInterval(() => {
      this.fetchRequestMsg(this.msgNum, this.lock);
    }, 1000);

    this.scrollDown();
    //add five etra message whenever user scoll to the top.
    setTimeout(() => {
      $("#cr-msg").on("scroll", function() {
        if ($(this).scrollTop() === 0) {
          self.fetchRequestMsg((self.msgNum += 5), false);
        }
      });
    }, 50);
  },

  mounted() {
    var self = this;
    //initialize editor
    ClassicEditor.create(document.querySelector("#editor"))
      .then(editor => {
        self.editor = editor;
        //editor.setData(self.requestData.details);
        // bind request detail to editor data
        editor.model.document.on("change", () => {
          self.newMsg = editor.getData();
        });
      })
      .catch(e => self.setGlobalError(e));
  },

  methods: {
    ...mapActions("errorStore", ["setGlobalError"]),

    //fetch request message
    fetchRequestMsg(num, scroll) {
      return HTTP()
        .get(`/change-request/${this.$route.params.id}/msg/${num}`)
        .then(({ data }) => {
          this.msgList = data.reverse();
          if (scroll) {
            this.scrollDown();
          }
        })
        .catch(e => {
          this.setGlobalError(e);
        });
    },

    scrollDown() {
      setTimeout(() => {
        $("#cr-msg").scrollTop($("#cr-msg")[0].scrollHeight);
      }, 20);
    },
    //http request to post new message
    sendMsg() {
      return HTTP()
        .post(`/change-request/${this.$route.params.id}/msg`, {
          content: this.newMsg
        })
        .then(({ data }) => {
          this.editor.setData("");
          this.fetchRequestMsg(this.msgNum, true);
        })
        .catch(e => {
          this.setGlobalError(e);
        });
    },

    //calculate duration
    formatTime(date) {
      var now = new Date();
      var time;
      // if msg date is today, display hour AM/PM, else display days.
      if (parseInt(date[8] + date[9]) !== now.getDate()) {
        var msgDate = Date.parse(date);
        var diff = now - msgDate;
        var day = Math.round(diff / 86400000);
        if (day <= 0) {
          time = Math.round(diff / 3600000) + " hours ago";
        } else {
          time = `${day} days ago`;
        }
      } else {
        //convert 24 hour to 12 hour + AM/PN
        var hour = date.split(" ")[1];
        hour = hour.substring(0, 5);
        var head = hour[0] + hour[1];
        if (head >= 12) {
          hour = 24 - head + hour.substring(2, 6);
          hour += " PM";
        } else {
          hour += " AM";
        }
        time = hour + " Today";
      }
      return time;
    }
  }
};
</script>

<style>
.ck-editor__editable {
  height: 250px;
}
#cr-msg {
  max-height: 75vh;
  overflow: auto;
}

@media (max-width: 480px) {
  .ck-editor__editable {
    height: 150px;
  }
}
</style>
