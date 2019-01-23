<template>
  <div class="wrapper">
    <Header :user="user"/>
    <Sidebar :user="user"/>

     <transition>
       <router-view/>
     </transition>
     
      
    <Controlbar/>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from "vuex";
import Header from "@/components/Main/Header.vue";
import Sidebar from "@/components/Main/Sidebar.vue";
import Controlbar from "@/components/Main/Controlbar.vue";

export default {
  name: "Main",
  namedspaced:false,
  components: {
    Header,
    Sidebar,
    Controlbar
  },
  computed: {
    ...mapGetters("authentication", ["isLoggedIn"]),
    ...mapState("authentication",["user"])
  },
  mounted () {
    document.body.className = "skin-blue sidebar-mini";
  },
  methods:{
    test(){
    }
  }
};
</script>

<style>
</style>
