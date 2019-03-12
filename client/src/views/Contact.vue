<template>
  <div style="background-color:white;">
    <section class="content-header">
      <h1 style="font-size:300%; text-align:center;">
        <i class="fa fa-commenting"></i>&nbsp;Contact
      </h1>
    </section>
    <section class="content">
      <hr>
      <div class="row">
        <div class="col-md-6">
          <div class="box box-danger" style="max-width:800px; margin:0 auto;">
            <!-- /.box-header -->
            <div class="box-body bg-danger">
              <h2 class="text-center">
                <label>Report Bugs!</label>
              </h2>
              <h4 class="text-center">Wei Zheng - Developer</h4>
              <h4 class="text-center">
                Email:
                <a href="mailto:wjzheng@usca.edu">wjzheng@usca.edu</a>
              </h4>
              <hr>
              <button
                @click="$modal.show('compose-msg',{receiver:['Wei J. Zheng (weijie0191@gmail.com)'], title:'I found a bug!!!'})"
                class="btn-bg btn btn-danger"
                style="width:100%;font-size:20px;border-radius:25px;"
              >Send Message!</button>
            </div>
            <!-- /.box-body -->
          </div>
        </div>
        <div class="col-md-6">
          <div class="box box-warning" style="max-width:800px; margin:0 auto;">
            <!-- /.box-header -->
            <div class="box-body bg-warning">
              <h2 class="text-center">
                <label>Ask for Helps</label>
              </h2>
              <h4 class="text-center">Wei Zheng - Developer</h4>
              <h4 class="text-center">
                Email:
                <a href="mailto:wjzheng@usca.edu">wjzheng@usca.edu</a>
              </h4>
              <hr>
              <button
                @click="$modal.show('compose-msg',{receiver:['Wei J. Zheng (weijie0191@gmail.com)'], title:'I need help!!'})"
                class="btn-bg btn btn-warning"
                style="width:100%;font-size:20px;border-radius:25px;"
              >Send Message!</button>
            </div>
            <!-- /.box-body -->
          </div>
        </div>
      </div>
      <hr>
      <div class="row">
        <div class="col-md-6">
          <div class="box box-primary" style="max-width:800px; margin:0 auto;">
            <!-- /.box-header -->
            <div class="box-body bg-primary">
              <h2 class="text-center">
                <label>Recommend Improvement</label>
              </h2>
              <h4 class="text-center">Wei Zheng - Developer</h4>
              <h4 class="text-center">
                Email:
                <a style="color:white;" href="mailto:wjzheng@usca.edu">wjzheng@usca.edu</a>
              </h4>
              <hr>
              <button
                @click="$modal.show('compose-msg',{receiver:['Wei J. Zheng (weijie0191@gmail.com)'], title:'I have ideas to improve your app!!!'})"
                class="btn-bg btn btn-primary"
                style="width:100%;font-size:20px;border-radius:25px;"
              >Send Message!</button>
            </div>
            <!-- /.box-body -->
          </div>
        </div>
        <div class="col-md-6">
          <div class="box box-success" style="max-width:800px; margin:0 auto;">
            <!-- /.box-header -->
            <div class="box-body bg-success">
              <h2 class="text-center">
                <label>Praise the Apps!</label>
              </h2>
              <h4 class="text-center">Wei Zheng - Developer</h4>
              <h4 class="text-center">
                Email:
                <a href="mailto:wjzheng@usca.edu">wjzheng@usca.edu</a>
              </h4>
              <hr>
              <button
                @click="$modal.show('compose-msg',{receiver:['Wei J. Zheng (weijie0191@gmail.com)'], title:'Your APP Look Super Nice!!!'})"
                class="btn-bg btn btn-success"
                style="width:100%;font-size:20px;border-radius:25px;"
              >Send Message!</button>
            </div>
            <!-- /.box-body -->
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {};
</script>

<style>
</style>
