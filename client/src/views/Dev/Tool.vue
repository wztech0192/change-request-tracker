<template>
  <div>
    <section class="content-header">
      <h1>
        <i class="fa fa-wrench"></i>&nbsp;&nbsp;Dev Tool
      </h1>
    </section>
    <section class="content" id="devtool">
      <div class="row">
        <div class="col-md-6">
          <div class="row">
            <div class="col-md-6">
              <div class="box box-warning">
                <div class="box-header text-yellow">
                  <h4>Generate Dummy User</h4>
                </div>
                <div class="box-body">
                  <input type="number" v-model="num" class="form-control">
                </div>
                <div class="box-footer">
                  <button class="btn btn-warning" @click="generateUser">
                    <i class="fa fa-warning"></i>&nbsp;&nbsp;Process
                  </button>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="box box-primary">
                <div class="box-header text-blue">
                  <h4>Correct Change Request Data</h4>
                </div>
                <div class="box-body">
                  <button
                    class="btn btn-primary"
                    style="padding:10%;border-radius:25px;"
                    @click="correctChangeRequest"
                  >Process</button>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12">
              <div class="box box-warning">
                <div class="box-header text-yellow">
                  <h4>Generate Dummy Change Request For Random User</h4>
                </div>
                <div class="box-body">
                  <input class="form-control" type="number" v-model="crnum">
                </div>
                <div class="box-footer">
                  <button class="btn btn-warning" @click="generateCR">Process</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="box box-success">
            <div class="box-header text-green">
              <h4>Generate Registration Code</h4>
              <h5 class="text-center">e.g. foo@foo.com; foo2@foo2.com; foo3@foo3.com</h5>
            </div>
            <div class="box-body">
              <textarea style="width:100%;height:175px;" v-model="receivers" class="form-control"></textarea>
            </div>
            <div class="box-footer">
              <button class="btn btn-success" @click="generatRegistCode">Send</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import HTTP from '@/http';

export default {
  data() {
    return {
      num: 0,
      crnum: 0,
      receivers: ''
    };
  },

  methods: {
    generatRegistCode() {
      if (window.confirm('Are you sure you want to do this?')) {
        const emailList = this.receivers.split(';');
        console.log(emailList);
        for (let email of emailList) {
          console.log(email.trim());
          HTTP()
            .post(`/regist-code`, {
              role: Math.random() >= 0.5 ? 'Client' : 'Admin',
              email: email.trim(),
              allowEdit: true,
              content:
                'This is not a spam. This is from CS Capstone project of Wei Zheng.' +
                'If you are using PacerStudent network, use this domain instead <a href="http://129.252.199.132/~weiZ/crt/public/">http://129.252.199.132/~weiZ/crt/public/</a> '
            })
            .then(({ data }) => {
              console.log(data);
            })
            .catch(e => {
              console.log(e);
            });
        }
      }
    },

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
#devtool .box h4 {
  font-weight: bold;
  text-align: center;
}

#devtool .box input,
#devtool .box button {
  text-align: center;
  width: 100%;
}
</style>
