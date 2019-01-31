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
        >
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
        >
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
      <hr>

      <a
        href="Registration Code Verification"
        @click.prevent="registrationCodeDialog"
        class="text-center"
      >Register a new membership</a>
    </form>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import HTTP from "@/http";
import router from "@/router";

export default {
  name: "Login",

  data() {
    return {
      login: { password: null, email: null },
      registCodeError: null,
      registCode: null
    };
  },

  mounted() {
    //intialize login email with exist data
    this.login.email = this.user.email;
  },

  computed: {
    ...mapState("authentication", ["user", "ex_error"])
  },

  methods: {
    ...mapMutations("authentication", [
      "setExceptionError",
      "setLoading",
      "setToken",
      "setRegistrationCode"
    ]),

    //show registration code dialog
    registrationCodeDialog() {
      this.$modal.show("dialog", {
        title: "Enter Registration Code",
        text: "<p class='regist-code-error text-red'></p><input style='width:100%;' class='regist-code' type='number'>",
        buttons: [
          {
            title: "Confirm",
            handler: () => {
              HTTP()
                .post("/regist-code/verify", { code: $('.regist-code').val() })
                .then(({ data }) => {
                  //if data exist set registration code to state, then direct to register page
                  if (data) {
                    this.setRegistrationCode(data.code);
                    this.$modal.hide("dialog");
                    router.push('/register');
                  } else {
                    $('.regist-code-error').text("Your Registration Code Is Incorrect");
                  }
                })
                .catch(() => {
                   $('.regist-code-error').text("Your Registration Code Is Incorrect");
                });
             // this.$modal.hide("dialog");
            }
          },
          {
            title: "Cancel"
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
        .post("/auth/login", this.login)
        .then(({ data }) => {
          // redirect router if data has token, else show error message
          if (data.token) {
            this.setToken(data.token);
            router.push("/");
          } else {
            this.showErrorAndClearPW("Wrong Password or Email!");
          }
        })
        .catch(e => {
          this.showErrorAndClearPW("Wrong Password or Email!");
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
