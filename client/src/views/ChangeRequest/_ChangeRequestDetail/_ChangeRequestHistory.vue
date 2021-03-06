<!--
 - @author: Wei Zheng
 - @description: display all change request history in time line
 -->

<template>
  <div class="box">
    <div v-if="histories">
      <transition-group
        name="list"
        tag="ul"
        class="timeline"
        v-for="histList in histories"
        :key="histList.date"
      >
        <li class="time-label" :key="histList.date">
          <span class="bg-gray">{{histList.date}}</span>
        </li>
        <!-- timeline item -->
        <li v-for="hist in histList.hists" :key="hist.id">
          <!-- timeline icon -->
          <i class="fa" :class="chooseIcon(hist.type)"></i>
          <div class="timeline-item">
            <span class="time">
              <i class="fa fa-clock-o"></i>
              {{calculateTimeElapsed(hist.created_at, [
              ' minutes ago',
              ' hours ago',
              ' days ago'
              ])}}
            </span>
            <h3 class="timeline-header text-blue">{{hist.type}}</h3>
            <div class="timeline-body">{{hist.content}}</div>
          </div>
        </li>
      </transition-group>
    </div>
    <div v-else class="overlay" style="height:200px; width:100%; position:relative;">
      <i class="fa fa-spinner fa-spin"></i>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';
import HTTP from '@/http';
import router from '@/router';

export default {
  props: {
    //tak request data from parent
    requestData: Object,
    // refresh value
    refresh: Number,
    //calculate time elapsed
    calculateTimeElapsed: Function
  },

  computed: {
    // extract status from requestData
    status() {
      return this.requestData.status;
    }
  },

  watch: {
    //update whenever status changed
    status() {
      setTimeout(() => {
        this.fetchRequestHistory();
      }, 10);
    },
    //update when refresh value change
    refresh() {
      console.log('hi');
      this.fetchRequestHistory();
    }
  },

  data() {
    return {
      histories: null
    };
  },

  created() {
    this.setTab('history');
    this.fetchRequestHistory();
  },

  methods: {
    ...mapActions('errorStore', ['setGlobalError']),
    ...mapMutations('crStore', ['setTab']),

    //fetch request history
    fetchRequestHistory() {
      return HTTP()
        .get(`/change-request/${this.$route.params.id}/hist`)
        .then(({ data }) => {
          this.histories = this.filterHist(data);
        })
        .catch(e => {
          this.setGlobalError(e);
          router.push('/');
        });
    },

    //return type icon
    chooseIcon(type) {
      switch (type) {
        case 'Create':
          return 'bg-blue fa-upload';
        case 'Edit Content':
          return 'bg-gray fa-edit';
        case 'New Status: TO DO':
          return 'bg-yellow fa-spinner';
        case 'New Status: IN PROGRESS':
          return 'bg-blue fa-refresh';
        case 'New Status: COMPLETE':
          return 'bg-green fa-check';
        case 'New Status: CANCELLED':
          return 'bg-red fa-ban';
      }
    },

    //filter Histories into each date. O(n)
    filterHist(histories) {
      var i = 0,
        j = 0;
      var filterHist = [];
      while (j < histories.length) {
        var hist = histories[j];
        var datetime = hist.created_at.split(' ');
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
