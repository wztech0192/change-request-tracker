<template>
  <div id='app'>
    <Main v-if="isLoggedIn"/>
    <Auth v-else/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Main from '@/components/Main.vue';
import Auth from '@/components/Auth.vue';

export default {
  components: {
    Main,
    Auth
  },
  computed: {
    ...mapGetters('authentication',['isLoggedIn'])
  }
};
</script>


<style lang='scss'>
.capitalize{
  text-transform: capitalize;
}
.fade {
  z-index:-100 !important;
}
.in{
  z-index:10000 !important;
}

</style>
