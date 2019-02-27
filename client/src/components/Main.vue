<template>
  <div class="wrapper">
    <Header
      :user="user"
      :flagList="flagList"
      :notifyList="notifyList"
      :clearNewNotification="clearNewNotification"
    />
    <Sidebar :user="user"/>

    <div class="content-wrapper">
      <transition name="slide-left" mode="out-in">
        <router-view/>
      </transition>
    </div>

    <Controlbar/>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex';
import Header from '@/components/_Main/Header.vue';
import Sidebar from '@/components/_Main/Sidebar.vue';
import Controlbar from '@/components/_Main/Controlbar.vue';

export default {
  name: 'Main',
  namedspaced: false,
  components: {
    Header,
    Sidebar,
    Controlbar
  },

  computed: {
    ...mapGetters('userStore', ['isLoggedIn']),
    ...mapState('userStore', ['user', 'flagList', 'notifyList', 'refresh'])
  },

  watch: {
    //update when refresh value change
    refresh() {
      this.fetchNavMenu('flag');
      this.fetchNavMenu('notification');
    }
  },

  created() {
    // set user profile into userStore.user state if user is logged in
    if (this.isLoggedIn) {
      this.fetchUser();
      this.fetchNavMenu('flag');
      this.fetchNavMenu('notification');
    }
  },

  methods: {
    ...mapActions('userStore', [
      'fetchUser',
      'fetchNavMenu',
      'clearNewNotification'
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
