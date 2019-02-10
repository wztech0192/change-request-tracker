<template>
  <div class="box-comments" style="background-color:transparent;">
    <div v-for="msg in msgList" class="box-comment">
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
    <!-- /.box-comment -->
  </div>
</template>

<script>
import { mapActions } from "vuex";
import HTTP from "@/http";
import router from "@/router";

export default {
  /* props:{
        requestData: Object,
        user: Object
    }*/
  data() {
    return {
      msgList: null
    };
  },

  created() {
    this.fetchRequestMsg();
  },

  methods: {
    ...mapActions("errorStore", ["setGlobalError"]),

    //fetch request history
    fetchRequestMsg() {
      return HTTP()
        .get(`/change-request/${this.$route.params.id}/msg`)
        .then(({ data }) => {
          console.log(data);
          this.msgList = data;
        })
        .catch(e => {
          this.setGlobalError(e);
          router.push("/");
        });
    },

    //calculate duration
    formatTime(date) {
      var diff = new Date() - Date.parse(date);
      var time;
      var day = Math.round(diff / 86400000);

      if (day > 1) {
        time = `${day} days ago`;
      } else {
        var hour = date.split(" ")[1];
        hour = hour.substring(0, 5);
        var head = hour[0] + hour[1];
        if (head => 12) {
          hour = (24 - head) + hour.substring(2, 6);
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
</style>
