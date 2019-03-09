<template>
  <div class="wrapper" :class="{'visibility-hide':!isLoggedIn}">
    <Header/>
    <Sidebar :user="user" :isAdmin="isAdmin" :isDev="isDev"/>

    <div class="content-wrapper">
      <transition name="slide-left" mode="out-in">
        <router-view v-if="isLoggedIn"/>
      </transition>
    </div>
    <Controlbar/>
    <ReadMessageModal/>
    <ComposeMessageModal/>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex';
import Header from '@/components/_Main/Header.vue';
import Sidebar from '@/components/_Main/Sidebar.vue';
import Controlbar from '@/components/_Main/Controlbar.vue';
import ComposeMessageModal from '@/components/Modal/ComposeMessageModal.vue';
import ReadMessageModal from '@/components/Modal/ReadMessageModal.vue';

export default {
  name: 'Main',
  namedspaced: false,
  components: {
    Header,
    Sidebar,
    Controlbar,
    ComposeMessageModal,
    ReadMessageModal
  },

  computed: {
    ...mapGetters('userStore', ['isLoggedIn', 'isAdmin', 'isDev']),
    ...mapState('userStore', ['user', 'refresh'])
  },

  watch: {
    //update when refresh value change
    refresh() {
      this.fetchNavMenu('flag');
      this.fetchNavMenu('notification');
      this.fetchNavMenu('msg');
    }
  },

  created() {
    // set user profile into userStore.user state if user is logged in
    if (this.isLoggedIn) {
      this.fetchUser();
      this.fetchNavMenu('flag');
      this.fetchNavMenu('notification');
      this.fetchNavMenu('msg');
    }
  },

  methods: {
    ...mapActions('userStore', ['fetchUser', 'fetchNavMenu'])
  },

  mounted() {
    if (this.isLoggedIn) {
      document.body.className = 'skin-black sidebar-mini';
      document.body.style.overflow = 'auto';
    }
  }
};
</script>

<style>
.visibility-hide {
  visibility: hidden;
  opacity: 0;
}
</style>
