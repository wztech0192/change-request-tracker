<template>
  <div class="wrapper">
    <Header/>
    <Sidebar/>
    <router-view/>
    <Controlbar/>
  </div>
</template>

<script>
import Header from "@/components/Main/Header/Header.vue";
import Sidebar from "@/components/Main/Sidebar.vue";
import Controlbar from "@/components/Main/Controlbar.vue";

export default {
  name: "Main",
  components: {
    Header,
    Sidebar,
    Controlbar
  },
  beforeCreate: () => {
    document.body.className = "hold-transition skin-blue sidebar-mini";
  }
};
</script>

<style>
</style>
