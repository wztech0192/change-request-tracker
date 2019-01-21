<template>
  <div class="login-box">
    <div class="login-logo">
      <p>
        <b>CR</b>Tracker
      </p>
    </div>
    <!-- /.login-logo -->
    <div class="login-box-body">
      <p class="login-box-msg">Sign in to start your session</p>

      <div class="form-group has-feedback">
        <input type="email" class="form-control" placeholder="Email">
        <span class="glyphicon glyphicon-envelope form-control-feedback"></span>
      </div>
      <div class="form-group has-feedback">
        <input type="password" class="form-control" placeholder="Password">
        <span class="glyphicon glyphicon-lock form-control-feedback"></span>
      </div>
      <div class="row">
        <!-- /.col -->
        <div class="col-xs-12">
          <button type="submit" class="btn btn-primary btn-block btn-flat">Sign In</button>
        </div>
        <!-- /.col -->
      </div>
      <hr>
       
       <router-link to='/register' class="text-center">Register a new membership</router-link>
    </div>
    <!-- /.login-box-body -->
  </div>
</template>

<script>
export default {
  name: "Login"
};
</script>

<style>
</style>
