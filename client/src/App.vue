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
html, body, #app{
  height:100% !important;
  width:100% !important;
  margin:0 !important;
  padding:0 !important;
  top:0 !important;
  left:0 !important;
  position:absolute;
}
.fade {
  z-index:-100 !important;
}
.in{
  z-index:10000 !important;
}

</style>
