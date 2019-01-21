<template>
<div>
    <router-view/>
</div>

</template>

<script>

export default {
  name: "Auth",
  beforeCreate: () => {
    document.body.className = "hold-transition login-page";
    
  }
};
</script>

<style>
</style>
