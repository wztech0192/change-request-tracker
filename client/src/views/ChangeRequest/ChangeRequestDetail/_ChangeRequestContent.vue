<template>
  <div class="box">
    <div class="box-header with-border">
      <h4 class="capitalize">{{requestData.title}}</h4>
    </div>
    <div class="box-body" >
      <div v-html="requestData.details"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    requestData: Object,
    user: Object
  }
};
</script>

<style>
</style>
