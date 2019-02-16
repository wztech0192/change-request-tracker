<template>
  <div>
    <section class="content-header">
      <h1>
        <i class="fa fa-wrench"></i>&nbsp;&nbsp;Dev Tool
      </h1>
    </section>
    <section class="content">
      <label>Generate Dummy User</label>
      <br>
      <input v-model="num">
      <br>
      <br>
      <button class="btn btn-primary" @click="generateUser">Process</button>
      <hr>
      <label>Correct Change Request Data</label>
      <br>
      <button class="btn btn-primary" @click="correctChangeRequest">Process</button>
      <hr>
      <label>Generate Dummy Change Request For Random User</label>
      <br>
      <input v-model="crnum">
      <br>
      <br>
      <button class="btn btn-primary" @click="generateCR">Process</button>
    </section>
  </div>
</template>

<script>
import HTTP from '@/http';

export default {
  data() {
    return {
      num: 0,
      crnum: 0
    };
  },

  methods: {
    generateUser() {
      if (window.confirm('Are you sure you want to do this?')) {
        alert('OK');
        return HTTP()
          .get(`test/generate/user/${this.num}`)
          .then(({ data }) => {
            console.log(data);
          })
          .catch(e => {
            alert(e);
            console.log(e);
          });
      }
    },

    generateCR() {
      if (window.confirm('Are you sure you want to do this?')) {
        alert('OK');
        return HTTP()
          .get(`test/generate/cr/${this.crnum}`)
          .then(({ data }) => {
            console.log(data);
          })
          .catch(e => {
            alert(e);
            console.log(e);
          });
      }
    },

    correctChangeRequest() {
      if (window.confirm('Are you sure you want to do this?')) {
        alert('OK');
        return HTTP()
          .get(`test/correctCR`)
          .then(({ data }) => {
            console.log(data);
          })
          .catch(e => {
            alert(e);
            console.log(e);
          });
      }
    }
  }
};
</script>

<style>
</style>
