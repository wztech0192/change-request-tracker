<!--
 - @author: Wei Zheng
 - @description: allow user to enter the website
 -->

<template>
  <div class="box login-box" style="background-color:transparent">
    <div class="login-logo">
      <p>
        <i class="fa fa-spinner"></i>
        <b>CR</b>Tracker
      </p>
    </div>

    <!-- /.login-logo -->
    <form class="login-box-body" @submit.prevent="loginSubmit">
      <p class="login-box-msg">Sign in to start your session</p>
      <transition name="fade">
        <div v-if="ex_error" class="alert alert-danger alert-dismissible">
          <h5>
            <i class="icon fa fa-ban"></i> Fail
          </h5>
          {{ex_error}}
        </div>
      </transition>
      <div class="form-group has-feedback">
        <input
          name="email"
          type="email"
          class="form-control"
          placeholder="Email"
          autocomplete="username"
          v-model="login.email"
        />
        <span class="glyphicon glyphicon-envelope form-control-feedback"></span>
      </div>
      <div class="form-group has-feedback">
        <input
          name="password"
          type="password"
          class="form-control"
          placeholder="Password"
          autocomplete="new-password"
          v-model="login.password"
        />
        <span class="glyphicon glyphicon-lock form-control-feedback"></span>
      </div>

      <div class="row">
        <!-- /.col -->
        <div class="col-xs-8">
          <a class="register-resetbtn btn btn-social-icon" @click.prevent="clearLoginData">
            <i class="fa fa-repeat"></i>
          </a>
        </div>
        <div class="col-xs-4">
          <button type="submit" class="btn btn-primary btn-block">
            Login&nbsp;&nbsp;&nbsp;
            <i class="fa fa-sign-in"></i>
          </button>
        </div>
        <!-- /.col -->
      </div>
      <hr />

      <a @click.prevent="registrationCodeDialog" class="text-center">Enter registration code</a>
      <br />
      <a @click.prevent="registrationEnter" class="text-center">Register new membership</a>
    </form>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import HTTP from '@/http';
import router from '@/router';

export default {
  name: 'Login',

  data() {
    return {
      login: { password: null, email: null },
      registCodeError: null,
      registCode: null
    };
  },

  created() {
    //intialize login email with exist data
    this.login.email = this.user.email;
  },

  computed: {
    ...mapState('userStore', ['user', 'ex_error'])
  },

  methods: {
    ...mapMutations('userStore', [
      'setExceptionError',
      'setLoading',
      'setToken',
      'setRegistrationCode'
    ]),

    ...mapActions('errorStore', ['setGlobalError']),
    ...mapActions('userStore', ['loginUser']),

    registrationEnter() {
      router.push('/register?noCode=true');
    },

    //show registration code dialog
    registrationCodeDialog() {
      this.$modal.show('dialog', {
        title:
          "<i class='fa fa-sign-in'></i>&nbsp;&nbsp;Enter Registration Code",
        template:
          "<input style='width:100%;' class='regist-code' type='number'>",
        maxWidth: 300,
        buttons: [
          {
            title: 'Confirm Code',
            default: true,
            handler: spinner => {
              spinner.loading = true;
              HTTP()
                .get(`/regist-code/verify/${$('.regist-code').val() || 'na'}`)
                .then(({ data }) => {
                  //if data exist set registration code to state, then direct to register page
                  if (data) {
                    this.setRegistrationCode(data.code);
                    this.$modal.hide('dialog');
                    router.push('/register');
                  } else {
                    $('.dialog-error').text(
                      'Your Registration Code Is Incorrect'
                    );
                  }
                })
                .catch(() => {
                  $('.dialog-error').text(
                    'Your Registration Code Is Incorrect'
                  );
                })
                .finally(() => {
                  spinner.loading = false;
                });
            }
          },
          {
            title: 'Cancel'
          }
        ]
      });
    },

    clearLoginData() {
      this.login.password = null;
      this.login.email = null;
      this.setExceptionError(null);
    },

    showErrorAndClearPW(msg) {
      this.login.password = null;
      this.setExceptionError(msg);
    },

    // login http request
    loginSubmit() {
      // clear exception error
      this.setExceptionError(null);
      this.setLoading(true);
      return HTTP()
        .post('/auth/login', this.login)
        .then(({ data }) => {
          // redirect router if data has token, else show error message
          if (data.token) {
            this.loginUser(data.token);
          } else {
            this.showErrorAndClearPW('Wrong Password or Email!');
          }
        })
        .catch(e => {
          var errorData = e.response;

          if (errorData.status !== 500) {
            this.showErrorAndClearPW('Wrong Password or Email!');
          } else {
            this.setGlobalError(e);
          }
        })
        .finally(() => {
          this.setLoading(false);
        });
    }
  }
};
</script>

<style>
.login-box-body {
  background: #d2d6de;
}
</style>
