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
      <i class="fa fa-spinner fa-spin"></i>
    </h1>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Main from '@/components/Main.vue';
import Auth from '@/components/Auth.vue';

export default {
  components: {
    Main,
    Auth
  },
  computed: {
    ...mapGetters('userStore', ['isLoggedIn']),
    ...mapGetters('errorStore', ['getGlobalError'])
  },
  watch: {
    //refresh page when login or logout
    isLoggedIn() {
      document.body.style.background = '#d2d6de';
      $('#app-content').hide();
      $('#loading-screen').show();
      location.reload();
    }
  },

  created() {
    //   console.log(this.isLoggedIn);
    /* Resolve conflict in jQuery UI tooltip with Bootstrap tooltip */
    $.widget.bridge('uibutton', $.ui.button);
  },

  mounted() {
    //prevent tab key
    /*  $(document).keydown(function(objEvent) {
      if (objEvent.keyCode == 9) {
        //tab pressed
        objEvent.preventDefault(); // stops its action
      }
    });*/
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
  height: 250px;
}
@media (max-width: 480px) {
  .ck-editor__editable {
    height: 150px;
  }
}

body {
  font-family: 'Roboto', sans-serif !important;
  font-size: 15px;
}

.skin-black .left-side,
.skin-black .main-sidebar,
.skin-black .wrapper {
  background-color: #1e282c;
}

.dataTables_wrapper {
  min-height: 400px;
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
.v--modal-block-scroll,
.v--modal-box {
  overflow: auto !important;
}

h1 {
  font-weight: 800;
}

.list-item {
  display: inline-block;
  margin-right: 10px;
}
.list-enter-active,
.list-leave-active {
  transition: all 0.5s;
}
.list-enter, .list-leave-to
/* .list-leave-active for below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
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
