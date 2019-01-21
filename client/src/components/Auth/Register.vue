<template>
  <form class="register-box">
    <div class="register-logo">
      <p>
        <b>CR</b>Tracker
      </p>
    </div>

    <form class="register-box-body" @submit.prevent="registerSubmit">
      <p class="login-box-msg">Register a new membership</p>

      <div>
        <div class="form-group has-feedback" v-bind:class="{'has-error':registerData.first_name_error}">
          <input
            type="text"
            class="form-control"
            placeholder="First Name"
            name="first_name"
            @input="setRegisterData"
            :value="registerData.first_name"
          >
          <span class="glyphicon glyphicon-user form-control-feedback"></span>
          <span
            class="help-block"
            >&nbsp;{{registerData.first_name_error}}</span>
        </div>
        <div class="form-group has-feedback">
          <input
            type="text"
            class="form-control"
            placeholder="M."
            name="mid_initial"
            @input="setRegisterData"
            :value="registerData.mid_initial"
          >
          <span class="glyphicon glyphicon-user form-control-feedback"></span>
          <br>
        </div>
        <div class="form-group has-feedback" v-bind:class="{'has-error':registerData.last_name_error}">
          <input
            type="text"
            class="form-control"
            placeholder="Last name"
            name="last_name"
            @input="setRegisterData"
            :value="registerData.last_name"
          >
          <span class="glyphicon glyphicon-user form-control-feedback"></span>
          <span
            class="help-block"
            >&nbsp;{{registerData.last_name_error}}</span>
        </div>
        <div class="form-group has-feedback" v-bind:class="{'has-error':registerData.email_error}">
          <input
            name="email"
            type="email"
            class="form-control"
            placeholder="Email"
            autocomplete="username"
            @input="setRegisterData"
            :value="registerData.email"
          >
          <span class="glyphicon glyphicon-envelope form-control-feedback"></span>
          <span
            class="help-block"
            >&nbsp;{{registerData.email_error}}</span>
        </div>
        <div class="form-group has-feedback" v-bind:class="{'has-error':registerData.password_error}">
          <input
            name="password"
            type="password"
            class="form-control"
            placeholder="Password"
            autocomplete="new-password"
            @input="setRegisterData"
            :value="registerData.password"
          >
          <span class="glyphicon glyphicon-lock form-control-feedback"></span>
          <span
            class="help-block"
            >&nbsp;{{registerData.password_error}}</span>
        </div>
        <div class="form-group has-feedback" v-bind:class="{'has-error':registerData.password_error}">
          <input
            name="password_retype"
            type="password"
            class="form-control"
            placeholder="Retype password"
            autocomplete="new-password"
            @input="setRegisterData"
            :value="registerData.password_retype"
          >
          <span class="glyphicon glyphicon-log-in form-control-feedback"></span>
        </div>
        <hr>
        <div class="row">
          <!-- /.col -->
          <div class="col-xs-8">
            <button class="register-resetbtn btn btn-social-icon" @click.prevent='clearRegisterData'>
              <i class="fa fa-repeat"></i>
            </button>
          </div>
          <div class="col-xs-4">
            <button type="submit" class="btn btn-primary btn-block">Register</button>
          </div>
          <!-- /.col -->
        </div>
        <hr>
        <router-link to="/login" class="text-center">I already have a membership</router-link>
      </div>
    </form>
    <!-- /.form-box -->
  </form>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  computed: {
    ...mapState("authentication", ["registerData"])
  },
  methods: {
    ...mapMutations("authentication", ["setRegisterData","clearRegisterData"]),
    ...mapActions("authentication", ["registerSubmit"])
  }
};
</script>

<style>
.register-resetbtn{
  border-radius:100%;
}
.register-box-body {
    background: #d2d6de;
}
.login-box, .register-box {
    margin: 1% auto;
}

</style>
