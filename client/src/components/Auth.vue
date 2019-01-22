<template>
<div>
    <router-view/>
</div>

</template>

<script>
export default {
  name: "Auth",
  beforeCreate: () => {
    document.body.className = "login-page";
  }
};
</script>

<style>
</style>
