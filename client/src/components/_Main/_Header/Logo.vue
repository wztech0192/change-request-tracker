<template>
  <!-- Logo -->
  <a
    class="logo"
    @mousedown.prevent="clickBegin"
    @touchstart.prevent="clickBegin"
    @mouseup.prevent="clickEnd"
    @touchend.prevent="clickEnd"
  >
    <!-- mini logo for sidebar mini 50x50 pixels -->
    <span class="logo-mini">
      <i class="fa fa-spinner" :class="{'fa-spin fast-spin': spin}"></i>
    </span>
    <!-- logo for regular state and mobile devices -->
    <span class="logo-lg">
      <b>C</b>RTracker
      <i class="fa fa-spinner" :class="{'fa-spin fast-spin': spin}"></i>
    </span>
  </a>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex';
export default {
  computed: {
    ...mapGetters('userStore', ['isLoggedIn'])
  },

  data() {
    return {
      spin: false,
      auto: false
    };
  },

  mounted() {
    // 0.5s for each cycle
    this.$el.addEventListener(
      'animationiteration',
      e => {
        if (!this.isLoggedIn) {
          // stop if user logout
          this.auto = false;
          this.spin = false;
        }

        // if spinner make two full circle active auto
        if (e.elapsedTime === 1) {
          this.auto = true;
        }

        if (this.auto) {
          //do http refresh every 2 second
          if (e.elapsedTime % 2 === 0) {
            this.addRefresh();
          }
        } else if (!this.click) {
          //stop spin
          this.spin = false;
        }
      },
      false
    );
  },
  methods: {
    ...mapMutations('userStore', ['addRefresh']),
    clickBegin() {
      if (this.auto) {
        this.auto = false;
      } else {
        //start spinning if spin is not start yet
        this.click = true;
        if (!this.spin) {
          this.addRefresh();
          this.spin = true;
        }
      }
    },

    clickEnd() {
      this.click = false;
    }
  }
};
</script>

<style>
.fast-spin {
  animation: fa-spin 0.5s infinite linear;
}
a.logo {
  user-select: none;
}
</style>
