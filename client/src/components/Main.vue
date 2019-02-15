<template>
  <div class="wrapper">
    <Header :user="user" :taskList="taskList"/>
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
import { mapGetters, mapActions, mapState } from "vuex";
import Header from "@/components/_Main/Header.vue";
import Sidebar from "@/components/_Main/Sidebar.vue";
import Controlbar from "@/components/_Main/Controlbar.vue";

export default {
  name: "Main",
  namedspaced: false,
  components: {
    Header,
    Sidebar,
    Controlbar
  },
  computed: {
    ...mapGetters("authentication", "isLoggedIn"),
    ...mapState("authentication", ["user", "taskList"]),
  },
  mounted() {
    document.body.className = "skin-black sidebar-mini";
       document.body.style.overflow="auto";
  },
};
</script>

<style>
</style>
