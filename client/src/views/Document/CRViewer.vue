<template>
  <div>
    <section class="content-header">
      <h1>
        <i class="fa fa-download"></i>&nbsp;Download CRViewer
      </h1>
    </section>
    <section class="content">
      <div class="row">
        <div class="col-lg-6">
          <h2>What is CRViewer?</h2>
          <p>
            CRViewer is a desktop application written in Java. The purpose of CRViewer is to view change request, it was
            purposely designated for those individuals who dislike using browsers.
            Both CRViewer and CRTracker consumed the same API Service.
          </p>

          <br />
          <h2>Features</h2>
          <ul>
            <li>Login Authentication</li>
            <li>Auto save credentials just like web app!</li>
            <li>A change request table that provided sorting, filtering, and searching functions</li>
            <li>View change request content with real-time update</li>
            <li>View and send change request messages with real-time update</li>
            <li>View and send change request histories with real-time update</li>
            <li>(For Admin only) Adjust change request status</li>
          </ul>
          <br />
          <h2>Requirement</h2>
          <p>
            Java version 8.0 or higher is required to run the app. If you do not have java installed, please visit
            <a
              href="https://www.java.com/en/download/"
            >here</a> for the instrutions on how to install java.
          </p>
          <hr />

          <a
            href="/crt/api/download/CRViewer.zip"
            download
            class="btn btn-primary btn-lg"
          >Download CRViewer</a>
          <hr />
          <ol>
            <li>Unzip the CRViewer.zip</li>
            <li>Extract CRViewer folder</li>
            <li>Run CRViewer.jar or CRViewer shotcut</li>
          </ol>
        </div>

        <div class="col-lg-6">
          <h2>Example:</h2>
          <img
            src="@/assets/crv_example.png"
            style="width:100%; max-width:400px;"
            alt="CRViewer Image"
          />
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
