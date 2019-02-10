<template>
  <div id="app">
    <div :class="{'fade z-index-out': !getGlobalError}" class="alert alert-danger flat error-bar">
      <button class="close" @click.prevent="clearGlobalError">X</button>
      <h4 style="text-align:left; margin:0;">
        <i class="icon fa fa-ban"></i> Alert!
      </h4>
      {{getGlobalError}}
    </div>
    <div id="app-content">
      <Main v-if="isLoggedIn"/>
      <Auth v-else/>
    </div>
    <h1 id="loading-screen">
      <i class="fa fa-spinner"></i>
    </h1>

    <MyDialog :adaptive="true" width="80%"/>'
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import Main from "@/components/Main.vue";
import Auth from "@/components/Auth.vue";
import MyDialog from "@/components/Modal/MyDialog.vue";

export default {
  components: {
    Main,
    Auth,
    MyDialog
  },
  computed: {
    ...mapGetters("authentication", ["isLoggedIn"]),
    ...mapGetters("errorStore", ["getGlobalError"])
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
    if (this.isLoggedIn) {
      this.fetchUser();
      this.fetchTaskList();
    }

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
    ...mapActions("authentication", ["fetchUser", "fetchTaskList"]),
    ...mapActions("errorStore", ["clearGlobalError"])
  }
};
</script>


<style lang='scss'>

.nav-tabs-custom>.nav-tabs>li.active{
  border-top-color: black !important;
}
.form-background {
  background-color: transparent;
}
.error-bar {
  z-index: 1000000;
  position: fixed;
  width: 100%;
  background-color: #dd4b39ed !important;
  border: none;
  top: 0;
  text-align: center;
  transition: 0.3s ease;
}
.z-index-out {
  z-index: -100 !important;
}
.capitalize {
  text-transform: capitalize;
}

a {
  cursor: pointer;
}

.content-wrapper {
  background-color: #f4f6f9 !important;
}

body {

  /*font-family:  "Helvetica Neue",Helvetica,Arial,sans-serif;*/
  font-size:150%;

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
a {
  -webkit-user-drag: none;
}

h1 {
  font-weight: 800;
}

@media (max-width: 480px) {
  .mobile-hide {
    display: none;
  }
}
</style>
