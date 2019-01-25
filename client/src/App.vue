<template>
  <div id="app">
    <div id="app-content">
      <Main v-if="isLoggedIn"/>
      <Auth v-else/>
    </div>
    <h1 id="loading-screen">
      <i class="fa fa-spinner"></i>
    </h1>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import Main from "@/components/Main.vue";
import Auth from "@/components/Auth.vue";

export default {
  components: {
    Main,
    Auth
  },
  computed: {
    ...mapGetters("authentication", ["isLoggedIn"])
  },
  watch: {
    //refresh page when login or logout
    isLoggedIn() {
      document.body.style.background = "#d2d6de";
      $("#app-content").hide();
      $("#loading-screen").show();
      location.reload();
    }
  },
  mounted() {
    // set user profile into authentication.user state if user is logged in
    if (this.isLoggedIn) this.fetchUser();

    $("body").tooltip({
      selector: '[data-toggle="tooltip"]',
      trigger: "hover"
    });
    //disable tooltip stays when toggle
    $('[data-toggle="tooltip"]').tooltip({
      trigger: "hover"
    });
  },
  methods: {
    ...mapActions("authentication", ["fetchUser"])
  }
};
</script>


<style lang='scss'>
.capitalize {
  text-transform: capitalize;
}
body {
  max-width: 100% !important;
}

#loading-screen {
  display: none;
  text-align: center;
  top: 30%;
  width: 100%;
  position: fixed;
  font-size: 1000%;
}

.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.1s;
  transition-property: opacity;
  transition-timing-function: ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition-duration: 0.2s;
  transition-property: height, opacity, transform;
  transition-timing-function: cubic-bezier(0.55, 0, 0.1, 1);
  overflow: hidden;
}

.slide-left-enter,
.slide-right-leave-active {
  opacity: 0;
  transform: translate(2em, 0);
}

.slide-left-leave-active,
.slide-right-enter {
  opacity: 0;
  transform: translate(-2em, 0);
}
.v--modal-block-scroll,
.v--modal-box {
  overflow: auto !important;
}
@media (min-width: 500px) {
  .v--modal-box {
    top: 20% !important;
  }
}
</style>
