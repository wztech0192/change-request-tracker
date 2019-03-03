<template>
  <div class="wrapper">
    <Header
      :user="user"
      :flagList="flagList"
      :notifyList="notifyList"
      :msgList="msgList"
      :clearNewNotification="clearNewNotification"
      :clearNewMsg="clearNewMsg"
    />
    <Sidebar :user="user"/>

    <div class="content-wrapper">
      <transition name="slide-left" mode="out-in">
        <router-view/>
      </transition>
    </div>

    <Controlbar/>
    <ReadMessageModal/>
    <ComposeMessageModal/>
    <MyDialog/>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex';
import Header from '@/components/_Main/Header.vue';
import Sidebar from '@/components/_Main/Sidebar.vue';
import Controlbar from '@/components/_Main/Controlbar.vue';
import MyDialog from '@/components/Modal/MyDialog.vue';
import ComposeMessageModal from '@/components/Modal/ComposeMessageModal.vue';
import ReadMessageModal from '@/components/Modal/ReadMessageModal.vue';

export default {
  name: 'Main',
  namedspaced: false,
  components: {
    Header,
    Sidebar,
    Controlbar,
    MyDialog,
    ComposeMessageModal,
    ReadMessageModal
  },

  computed: {
    ...mapGetters('userStore', ['isLoggedIn']),
    ...mapState('userStore', [
      'user',
      'flagList',
      'notifyList',
      'msgList',
      'refresh'
    ])
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
    ...mapActions('userStore', [
      'fetchUser',
      'fetchNavMenu',
      'clearNewNotification',
      'clearNewMsg'
    ])
  },

  mounted() {
    document.body.className = 'skin-black sidebar-mini';
    document.body.style.overflow = 'auto';
  }
};
</script>

<style>
</style>
