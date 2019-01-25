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
      <div v-if="error.ex_error" class="alert alert-danger alert-dismissible">
        <h5>
          <i class="icon fa fa-ban"></i> Fail
        </h5>
        {{error.ex_error}}
      </div>
    </transition>
      <div class="form-group has-feedback">
        <input
          name="email"
          type="email"
          class="form-control"
          placeholder="Email"
          autocomplete="username"
          @input="setLoginData"
          :value="user.email"
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
          @input="setLoginData"
          :value="user.password"
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
          <button type="submit" class="btn btn-primary btn-block">Login&nbsp;&nbsp;&nbsp;
            <i class="fa fa-sign-in"></i>
          </button>
        </div>
        <!-- /.col -->
      </div>
      <hr>

      <router-link to="/register" class="text-center">Register a new membership</router-link>
    </form>

    <!-- /.login-box-body -->
    <!--<div class="overlay fade" v-bind:class="{'in':loading}">
      <i class="fa fa-refresh fa-spin"></i>
    </div>-->
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  name: "Login",
  computed: {
    ...mapState("authentication", ["user", "error", "loading"])
  },
  methods: {
    ...mapMutations("authentication", ["setLoginData", "clearLoginData", "clearExceptionError"]),
    ...mapActions("authentication", ["loginSubmit"])
  }
};
</script>

<style>
.login-box-body {
  background: #d2d6de;
}
</style>
