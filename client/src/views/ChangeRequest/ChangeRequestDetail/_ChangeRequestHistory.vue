<template>
  <div class="box">
    <div v-if="histories">
      <ul class="timeline" v-for="histList in histories">
        <li class="time-label">
          <span class="bg-gray">{{histList.date}}</span>
        </li>
        <!-- timeline item -->
        <li v-for="hist in histList.hists">
          <!-- timeline icon -->
          <i class="fa" :class="chooseIcon(hist.type)"></i>
          <div class="timeline-item">
            <span class="time">
              <i class="fa fa-clock-o"></i>
              {{calDuration(hist.created_at)}}
            </span>
            <h3 class="timeline-header text-blue">{{hist.type}}</h3>
            <div class="timeline-body">{{hist.content}}</div>
          </div>
        </li>
      </ul>
    </div>
    <div v-else class="overlay" style="height:200px; width:100%; position:relative;">
      <i class="fa fa-refresh fa-spin"></i>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations } from "vuex";
import HTTP from "@/http";
import router from "@/router";

export default {
  /* props:{
        requestData: Object,
        user: Object
    }*/
  data() {
    return {
      histories: null
    };
  },

  created() {
    this.setTab("history");
    this.fetchRequestHistory();
  },

  methods: {
    ...mapActions("errorStore", ["setGlobalError"]),
    ...mapMutations("changeRequest", ["setTab"]),

    //fetch request history
    fetchRequestHistory() {
      return HTTP()
        .get(`/change-request/${this.$route.params.id}/hist`)
        .then(({ data }) => {
          this.histories = this.filterHist(data);
        })
        .catch(e => {
          this.setGlobalError(e);
          router.push("/");
        });
    },

    //calculate duration
    calDuration(date) {
      var diff = new Date() - Date.parse(date);
      var time;
      if (diff > 86400000) {
        time = Math.round(diff / 86400000) + " days ago";
      } else if (diff > 3600000) {
        time = Math.round(diff / 3600000) + " hours ago";
      } else {
        time = Math.round(diff / 60000) + " mins ago";
      }
      return time;
    },

    //return type icon
    chooseIcon(type) {
      switch (type) {
        case "Create":
          return "bg-blue fa-upload";
        case "Edit":
          return "bg-gray fa-edit";
      }
    },

    //filter Histories into each date.
    filterHist(histories) {
      var i = 0,
        j = 0;
      var filterHist = [];
      while (j < histories.length) {
        var hist = histories[j];
        var datetime = hist.created_at.split(" ");
        var fh = filterHist[i];
        if (!fh) {
          filterHist.push({
            date: datetime[0],
            hists: [hist]
          });
        } else if (fh.date !== datetime[0]) {
          i++;
          continue;
        } else {
          fh.hists.push(hist);
        }
        j++;
      }
      return filterHist;
    }
  }
};
</script>

<style>
</style>
