<template>
  <div class="content-wrapper">
    <section class="content-header">
      <h1>
        To-Do
        <small>on progress</small>
      </h1>
      <ol class="breadcrumb">
        <li>
          <a href="#">
            <i class="fa fa-code"></i> Home
          </a>
        </li>
        <li>
          <a href="#">Todo</a>
        </li>
      </ol>
    </section>
    <section class="content">
      <div class="box box-default" data-widget="box-widget">
        <div class="box-header with-border">
          <h2 class="box-title">List</h2>
          <div class="box-tools pull-right">
            <button type="button" class="btn btn-box-tool" data-widget="collapse">
              <i class="fa fa-minus"></i>
            </button>
          </div>
        </div>
        <!-- /.box-header -->
        <div class="box-body">
          <div class="box box-widget" data-widget="box-widget">
            <div class="box-header with-border">
              <h5 class="box-title" style="font-size:100%">
                <button type="button" class="btn btn-box-tool" data-widget="collapse">
                  <i class="fa fa-minus"></i>
                </button>
                Create Database
              </h5>

              <div class="pull-right progress" style="width:50%; margin:5px;">
                <div
                  class="progress-bar progress-bar-primary progress-bar-striped"
                  role="progressbar"
                  aria-valuenow="40"
                  aria-valuemin="0"
                  aria-valuemax="100"
                  style="width: 5%;"
                ></div>
              </div>
            </div>
            <div class="box-body">
              <p>'HELLO'</p>
            </div>
          </div>
        </div>
        <!-- /.box-body -->
        <div class="box-footer">
          Visit
          <a href="https://select2.github.io/">Select2 documentation</a> for more examples and information about
          the plugin.
        </div>
      </div>
    </section>
    <div data-widget="todo-list">
      <input type="checkbox">
    </div>
  </div>
</template>

<script>
export default {
    name:'DevTodo'
};
</script>

<style>
</style>
