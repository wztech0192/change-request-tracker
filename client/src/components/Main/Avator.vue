<template>
  <div class="user-image avator" :style="{'background-color':backgroundPicker()}">
    <span :style="{'color':fontColorPicker()}">{{firstName.charAt(0)+lastName.charAt(0)}}</span>
  </div>
</template>

<script>
export default {
  props: {
    firstName: String,
    lastName: String
  },
  methods:{
      fontColorPicker(){
          return 'white';
      },

      backgroundPicker(){
          return 'red';
      }
  }
};
</script>

<style>
.avator {
  text-align: center;
  font-size: 75%;
  line-height: inherit !important;
}
</style>
