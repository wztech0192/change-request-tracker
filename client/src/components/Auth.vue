<template>
  <div>
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

