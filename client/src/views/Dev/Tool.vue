<template>
  <div>
    <section class="content-header">
      <h1>
        <i class="fa fa-wrench"></i>&nbsp;&nbsp;Dev Tool
      </h1>
    </section>
    <section class="content">
      <label>Generate User</label>
      <br>
      <input v-model="num">

      <br>
      <button class="btn btn-primary" @click="generateUser">Process</button>
      <hr>
      <br>

      <br>
      <button class="btn btn-secondary" @click="correctChangeRequest">Correct Change Request</button>
    </section>
  </div>
</template>

<script>
import HTTP from "@/http";
export default {
  data() {
    return {
      num: 0
    };
  },
  methods: {
    generateUser() {
      return HTTP()
        .get(`test/generate/user/${this.num}`)
        .then(({ data }) => {
          alert(data);
        })
        .catch(e => {
          alert(e);
          console.log(e);
        });
    },

    correctChangeRequest() {
      return HTTP()
        .get(`test/correctCR`)
        .then(({ data }) => {
          alert(data);
        })
        .catch(e => {
          alert(e);
          console.log(e);
        });
    }
  }
};
</script>

<style>
</style>
