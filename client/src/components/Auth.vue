<template>
  <div id="auth">
    <transition name="slide-left" mode="out-in">
      <router-view/>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'Auth',
  beforeCreate: () => {
    document.body.className = 'login-page';
    document.body.style.overflow = 'hidden';
  }
};
</script>

<style>
#auth {
  top: 0;
  position: absolute;
  width: 100%;
}
</style>

