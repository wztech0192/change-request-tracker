<!--
 - @author: Wei Zheng
 - @description: allow user to register account
 -->

<template>
  <div class="box register-box" style="background-color:transparent;">
    <div class="register-logo">
      <p>
        <i class="fa fa-spinner"></i>
        <b>CR</b>Tracker
      </p>
    </div>
    <form class="register-box-body" @submit.prevent="registerSubmit">
      <p class="login-box-msg">Register a new membership</p>

      <div>
        <div class="form-group has-feedback" :class="{'has-error':error.first_name_error}">
          <input
            type="text"
            class="form-control"
            placeholder="First Name"
            name="first_name"
            :readonly="!this.allowEdit"
            v-model="registerData.first_name"
            @blur="clearError('first_name')"
          >
          <span class="glyphicon glyphicon-user form-control-feedback"></span>
          <span class="help-block">&nbsp;{{error.first_name_error}}</span>
        </div>
        <div class="form-group has-feedback">
          <input
            type="text"
            class="form-control"
            placeholder="M."
            name="mid_initial"
            :readonly="!this.allowEdit"
            v-model="registerData.mid_initial"
            @blur="clearError('mid_initial')"
          >
          <span class="glyphicon glyphicon-user form-control-feedback"></span>
          <br>
        </div>
        <div class="form-group has-feedback" :class="{'has-error':error.last_name_error}">
          <input
            type="text"
            class="form-control"
            placeholder="Last name"
            name="last_name"
            :readonly="!this.allowEdit"
            v-model="registerData.last_name"
            @blur="clearError('last_name')"
          >
          <span class="glyphicon glyphicon-user form-control-feedback"></span>
          <span class="help-block">&nbsp;{{error.last_name_error}}</span>
        </div>
        <div class="form-group has-feedback" :class="{'has-error':error.email_error}">
          <input
            name="email"
            type="email"
            class="form-control"
            :readonly="!this.allowEdit"
            placeholder="Email: example@domain.com"
            autocomplete="username"
            v-model="registerData.email"
            @blur="clearError('email')"
          >
          <span class="glyphicon glyphicon-envelope form-control-feedback"></span>
          <span class="help-block">&nbsp;{{error.email_error}}</span>
        </div>
        <div class="form-group has-feedback" :class="{'has-error':error.password_error}">
          <input
            name="password"
            type="password"
            class="form-control"
            placeholder="Password"
            autocomplete="new-password"
            v-model="registerData.password"
          >
          <span class="glyphicon glyphicon-lock form-control-feedback"></span>
          <span class="help-block">&nbsp;{{error.password_error}}</span>
        </div>
        <div class="form-group has-feedback" :class="{'has-error':error.password_error}">
          <input
            name="password_retype"
            type="password"
            class="form-control"
            placeholder="Retype password"
            autocomplete="new-password"
            v-model="registerData.password_retype"
          >
          <span class="glyphicon glyphicon-log-in form-control-feedback"></span>
        </div>
        <div class="row">
          <!-- /.col -->
          <div class="col-xs-8">
            <a class="register-resetbtn btn btn-social-icon" @click.prevent="clearRegisterData">
              <i class="fa fa-repeat"></i>
            </a>
          </div>
          <div class="col-xs-4">
            <button type="submit" class="btn btn-primary btn-block">
              Register
              <i class="fa fa-sign-in"></i>
            </button>
          </div>
          <!-- /.col -->
        </div>
        <hr>
        <router-link to="/login" class="text-center">I already have a membership</router-link>
      </div>
    </form>
    <!-- loading box -->
    <!--<div v-if="loading" class="overlay">
      <i class="fa fa-refresh fa-spin"></i>
    </div>-->
  </div>
</template>

<script>
import { mapMutations, mapActions, mapState } from 'vuex';
import HTTP from '@/http';
import router from '@/router';

export default {
  data() {
    return {
      //empty object to be fill: registerData and error
      registerData: {
        first_name: null,
        mid_initial: null,
        last_name: null,
        email: null,
        password: null,
        password_retype: null
      },
      error: {
        first_name_error: null,
        last_name_error: null,
        email_error: null,
        password_error: null
      },
      allowEdit: true
    };
  },
  watch: {
    password() {
      this.confirmPassword(this.registerData);
    },
    password_retype() {
      this.confirmPassword(this.registerData);
    }
  },

  //verify registration code before created
  created() {
    HTTP()
      .post('/regist-code/verify', { code: this.registrationCode })
      .then(({ data }) => {
        if (data) {
          //fill in register data from the registration code
          this.registerData.first_name = data.first_name;
          this.registerData.last_name = data.last_name;
          this.registerData.mid_initial = data.mid_initial;
          this.registerData.email = data.email;
          this.allowEdit = data.allowEdit === 1;
          this.registerData.code = data.code;
        } else {
          this.setGlobalError('Registration code failed!');
          router.push('/login');
        }
      })
      .catch(e => {
        this.setGlobalError(e);
        router.push('/login');
      });
  },

  computed: {
    ...mapState('authentication', ['registrationCode']),
    password() {
      return this.registerData.password;
    },
    password_retype() {
      return this.registerData.password_retype;
    }
  },

  methods: {
    ...mapMutations('authentication', ['setLoading', 'setToken']),
    ...mapActions('errorStore', ['setGlobalError']),

    //clear register datas by set it to empty object
    clearRegisterData() {
      this.registerData.first_name = null;
      this.registerData.mid_initial = null;
      this.registerData.last_name = null;
      this.registerData.email = null;
      this.registerData.password = null;
      this.registerData.password_retype = null;
      this.error.first_name_error = null;
      this.error.last_name_error = null;
      this.error.password_error = null;
      this.error.email_error = null;
    },

    // make sure password and confirm password are match and more than 6 characters
    confirmPassword(rd) {
      if (rd.password && rd.password.length < 6) {
        this.error.password_error =
          'Password need to have more than 6 characters';
        return false;
      }
      if (rd.password !== rd.password_retype) {
        this.error.password_error =
          'Your password and confirmation password do not match.';
        return false;
      }
      this.error.password_error = null;
      return true;
    },

    //clear selector's error message
    clearError(selector) {
      this.error[selector + '_error'] = null;
    },

    // loop through all exception error then set message to the associated field
    setErrorMessage(exceptionArr) {
      exceptionArr.forEach(({ field, message }) => {
        this.error[field + '_error'] = message;
      });
    },

    // submit register data to server
    registerSubmit() {
      const rd = this.registerData;
      if (this.confirmPassword(rd)) {
        this.setLoading(true);
        HTTP()
          .post('/auth/register', rd)
          .then(({ data }) => {
            // Set token and clear register data if token is avaliable, else return validation error
            if (data.token) {
              this.setToken(data.token);
              // redirect route plus reload page
              // window.location.href = "/";
              router.push('/');
            } else {
              this.setErrorMessage(data);
            }
          })
          .catch(e => {
            this.setGlobalError(e);
          })
          .finally(() => {
            this.setLoading(false);
          });
      } else {
        rd.password = null;
        rd.password_retype = null;
      }
    }
  }
};
</script>

<style>
.register-resetbtn {
  border-radius: 100%;
}
.register-box-body {
  background: #d2d6de;
}
.register-box {
  margin: 1% auto;
}
</style>
