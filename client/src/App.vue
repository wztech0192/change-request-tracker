<template>
  <div id="app">
    <div :class="{'fade z-index-out': !getGlobalError}" class="alert alert-danger flat error-bar">
      <button class="close" @click.prevent="clearGlobalError">X</button>
      <h4 style="text-align:left; margin:0;">
        <i class="icon fa fa-warning"></i> Alert!
      </h4>
      {{getGlobalError}}
    </div>
    <div id="app-content">
      <Main/>
      <transition name="slide-left" mode="out-in">
        <Auth v-if="!isLoggedIn"/>
      </transition>
    </div>

    <h1 id="loading-screen">
      <i class="fa fa-spinner fa-spin"></i>
    </h1>
    <MyDialog/>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Main from '@/components/Main.vue';
import Auth from '@/components/Auth.vue';
import MyDialog from '@/components/Modal/MyDialog.vue';

export default {
  components: {
    Main,
    Auth,
    MyDialog
  },
  computed: {
    ...mapGetters('userStore', ['isLoggedIn']),
    ...mapGetters('errorStore', ['getGlobalError'])
  },

  created() {
    //   console.log(this.isLoggedIn);
    /* Resolve conflict in jQuery UI tooltip with Bootstrap tooltip */
    $.widget.bridge('uibutton', $.ui.button);
    //set select2 theme
    $.fn.select2.defaults.set('theme', 'bootstrap');
  },

  mounted() {
    $('body').tooltip({
      selector: '[data-toggle="tooltip"]',
      trigger: 'hover'
    });
    //disable tooltip stays when toggle
    $('[data-toggle="tooltip"]').tooltip({
      trigger: 'hover'
    });
  },

  methods: {
    ...mapActions('errorStore', ['clearGlobalError'])
  }
};
</script>


<style>
.ck-editor__editable {
  min-height: 100px;
  height: auto;
  max-height: 400px;
}

.small-box,
.box {
  box-shadow: 0 0 1px rgba(0, 0, 0, 0.125), 0 1px 3px rgba(0, 0, 0, 0.2) !important;
}
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif !important;
  font-size: 15px;
}

.skin-black .left-side,
.skin-black .main-sidebar,
.skin-black .wrapper {
  background-color: #1e282c;
}
.small-box .icon {
  top: -18px;
}
.dataTables_wrapper {
  min-height: 400px;
}
.tooltip {
  z-index: 1000 !important;
}
.overlay > h2 {
  font-size: 10vw;
  padding: 10vw;
  text-align: center;
}
.nav-tabs-custom > .nav-tabs > li.active {
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
.main-header {
  z-index: 1011 !important;
}
.z-index-out {
  z-index: -100 !important;
}
.capitalize {
  text-transform: capitalize;
}

.bold {
  font-weight: bold;
}
a {
  text-decoration: none !important;
  cursor: pointer;
}
.clickable {
  cursor: pointer;
}

.content-wrapper {
  background-color: #f4f6f9 !important;
}

#loading-screen {
  display: none;
  text-align: center;
  top: 30%;
  width: 100%;
  position: fixed;
  font-size: 1000%;
}
.v--modal-overlay {
  z-index: 1012 !important;
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

.slide-top-enter-active,
.slide-top-leave-active,
.slide-down-enter-active,
.slide-down-leave-active {
  transition-duration: 0.4s;
  transition-property: height, opacity, transform;
  transition-timing-function: cubic-bezier(0.55, 0, 0.1, 1);
  overflow: hidden;
}

.slide-top-enter,
.slide-down-leave-active {
  opacity: 0;
  transform: translate(0, 8em);
}

.slide-top-leave-active,
.slide-down-enter {
  opacity: 0;
  transform: translate(0, -8em);
}

.v--modal-block-scroll,
.v--modal-box {
  overflow: auto !important;
}

h1 {
  font-weight: 800;
}

.list-item {
  display: inline-block;
}
.list-enter-active,
.list-leave-active {
  transition: all 0.4s;
}
.list-enter, .list-leave-to
/* .list-leave-active for below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(10px);
}

.none-ex {
  display: none;
}

@media (max-width: 480px) {
  .not-mobile-ex {
    display: none;
  }
  h1 {
    margin: 0;
    font-size: 20px !important;
  }
  body {
    /*font-family:  "Helvetica Neue",Helvetica,Arial,sans-serif;*/
    font-size: 13px !important;
  }
}

@media (max-width: 1048px) {
  .desktop-ex {
    display: none;
  }
}
</style>
