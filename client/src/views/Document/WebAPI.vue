<template>
  <div>
    <section class="content-header">
      <h1>
        <i class="fa fa-link"></i>&nbsp;Web API
      </h1>
    </section>
    <section class="content">
      <table class="table table-border table-striped table-hover">
        <thead>
          <tr>
            <th colspan="3">
              <h3>Unauthenticated Routes
                <br>
                <small>The user is not expected to provide an ID token in each request header.</small>
              </h3>
            </th>
          </tr>
          <tr>
            <th>Method</th>
            <th>Route</th>
            <th>Purpose</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>POST</td>
            <td>/auth/register</td>
            <td>Register a user account.</td>
          </tr>
          <tr>
            <td>POST</td>
            <td>/auth/login</td>
            <td>Login user account. Return the user ID token.</td>
          </tr>
          <tr>
            <td>POST</td>
            <td>/regist-code/verify</td>
            <td>Validate if the registration code exist in the CRT database.</td>
          </tr>
          <tr>
            <td>POST</td>
            <td>/change-request/mail-submit</td>
            <td>Take incoming emails from Mailgun service.</td>
          </tr>
          <tr>
            <td>POST</td>
            <td>/change-request/mail-request-info</td>
            <td>Process request from email and return change request information</td>
          </tr>
          <tr>
            <th colspan="3">
              <h3>Authenticated Routes
                <br>
                <small>The user is expected and required to provide ID token in each request header, or the request will be denied.</small>
              </h3>
            </th>
          </tr>

          <tr>
            <th>Method</th>
            <th>Route</th>
            <th>Purpose</th>
          </tr>

          <tr>
            <td>GET</td>
            <td>/user</td>
            <td>Return information of current user.</td>
          </tr>
          <tr>
            <td>GET</td>
            <td>/user/all</td>
            <td>Return every user’s information listed in the system.</td>
          </tr>
          <tr>
            <td>GET</td>
            <td>/user/flag</td>
            <td>Return list of a flagged item owned by the current user (e.g. flagged change request).</td>
          </tr>
          <tr>
            <td>GET</td>
            <td>/user/notification</td>
            <td>Return all unread notifications and notifications from the last 3 days of the current user.</td>
          </tr>
          <tr>
            <td>GET</td>
            <td>/user/msg</td>
            <td>Return all unread and marked messages of the current user.</td>
          </tr>
          <tr>
            <td>POST</td>
            <td>/user/notification/paginate</td>
            <td>Return paginated notifications list of the current user. Used in notification datatable.</td>
          </tr>
          <tr>
            <td>PATCH</td>
            <td>/user/notification/clear-new/:target</td>
            <td>Modify the targetnotification from unread to read.</td>
          </tr>
          <tr>
            <td>GET</td>
            <td>/user/:id</td>
            <td>Return a user by id.</td>
          </tr>
          <tr>
            <td>GET</td>
            <td>/user/by-role/:role</td>
            <td>Return user list by the role.</td>
          </tr>
          <tr>
            <td>POST</td>
            <td>/user/search/:role</td>
            <td>Search user by role.</td>
          </tr>
          <tr>
            <td>POST</td>
            <td>/user/datatable</td>
            <td>Return list of users. Used to perform datatable server processing.</td>
          </tr>
          <tr>
            <td>DELETE</td>
            <td>/user/:id</td>
            <td>Delete user by id.</td>
          </tr>
          <tr>
            <td>PATCH</td>
            <td>/user/:id</td>
            <td>Update user by id.</td>
          </tr>
          <tr>
            <td>GET</td>
            <td>/regist-code</td>
            <td>Return list of registration code.</td>
          </tr>
          <tr>
            <td>POST</td>
            <td>/regist-code</td>
            <td>Create new registration code.</td>
          </tr>
          <tr>
            <td>Delete</td>
            <td>/regist-code:id</td>
            <td>Delete registration code by id.</td>
          </tr>
          <tr>
            <td>PATCH</td>
            <td>regist-code:id</td>
            <td>Update registration code by id.</td>
          </tr>
          <tr>
            <td>GET</td>
            <td>/test/generate/user/:num</td>
            <td>Generate number of dummy users.</td>
          </tr>
          <tr>
            <td>GET</td>
            <td>/test/generat/cr/:num</td>
            <td>Generate number of dummy change requests.</td>
          </tr>
          <tr>
            <td>GET</td>
            <td>/test/correctCR</td>
            <td>Refresh change request data field after the data got mess up by testing.</td>
          </tr>
          <tr>
            <td>GET</td>
            <td>/test/generate/user/:num</td>
            <td>Generate number of dummy users.</td>
          </tr>
          <tr>
            <td>GET</td>
            <td>/dev</td>
            <td>Return all developer to-do groups.</td>
          </tr>
          <tr>
            <td>POST</td>
            <td>/dev/todo</td>
            <td>Create new to-do group.</td>
          </tr>
          <tr>
            <td>DELETE</td>
            <td>/dev/todo/:id</td>
            <td>Delete to-do group by id.</td>
          </tr>
          <tr>
            <td>PATCH</td>
            <td>/dev/todo/:id</td>
            <td>Update to-do group by id.</td>
          </tr>
          <tr>
            <td>POST</td>
            <td>/dev/todo/:id/task</td>
            <td>Add a task to to-do group by id.</td>
          </tr>
          <tr>
            <td>DELETE</td>
            <td>/dev/task/:id</td>
            <td>Delete task by id.</td>
          </tr>
          <tr>
            <td>PATCH</td>
            <td>/dev/task/:id</td>
            <td>Update task by id.</td>
          </tr>
          <tr>
            <td>PATCH</td>
            <td>/dev/task/complete/:id</td>
            <td>Set task to complete.</td>
          </tr>
          <tr>
            <td>DELETE</td>
            <td>/dev/todo/:id</td>
            <td>Delete to-do group.</td>
          </tr>
          <tr>
            <td>GET</td>
            <td>/message/:id</td>
            <td>Return message by id.</td>
          </tr>
          <tr>
            <td>POST</td>
            <td>/message/list</td>
            <td>Return all message of the current user in the paginated formula.</td>
          </tr>
          <tr>
            <td>POST</td>
            <td>/message Create</td>
            <td>new message.</td>
          </tr>
          <tr>
            <td>DELETE</td>
            <td>/message/:id</td>
            <td>Delete message by id.</td>
          </tr>
          <tr>
            <td>PATCH</td>
            <td>/message/clear-new</td>
            <td>Mark the message as read.</td>
          </tr>
          <tr>
            <td>PATCH</td>
            <td>/message/archive</td>
            <td>Toggle the message archive status.</td>
          </tr>
          <tr>
            <td>PATCH</td>
            <td>/message/:id</td>
            <td>Update message by id.</td>
          </tr>
          <tr>
            <td>POST</td>
            <td>/change-request/list</td>
            <td>Return change request list of the current user filtered by request tabs.</td>
          </tr>
          <tr>
            <td>POST</td>
            <td>/change-request/admin/list</td>
            <td>Return all change request in the system and filter by the request.</td>
          </tr>
          <tr>
            <td>GET</td>
            <td>/change-request/chart/:range</td>
            <td>Return change request status ratio of requested date range. Used in ChartJS.</td>
          </tr>
          <tr>
            <td>POST</td>
            <td>/change-request/admin/list</td>
            <td>Return all change request in the system and filter by the request.</td>
          </tr>
          <tr>
            <td>GET</td>
            <td>/change-request/:id</td>
            <td>Return change request by id.</td>
          </tr>
          <tr>
            <td>POST</td>
            <td>/change-request/</td>
            <td>Create new change request.</td>
          </tr>
          <tr>
            <td>DELETE</td>
            <td>/change-request/:id</td>
            <td>Delete change request by id.</td>
          </tr>
          <tr>
            <td>PATCH</td>
            <td>/change-request/:id</td>
            <td>Update change request content by id.</td>
          </tr>
          <tr>
            <td>DELETE</td>
            <td>/change-request/:id/unflag</td>
            <td>Delete change request in flagged list.</td>
          </tr>
          <tr>
            <td>POST</td>
            <td>/change-request/:id/flag</td>
            <td>Add change request into flag list.</td>
          </tr>
          <tr>
            <td>GET</td>
            <td>/change-request/:id/msg/:num</td>
            <td>Return requested number of messages in requested change request id.</td>
          </tr>
          <tr>
            <td>POST</td>
            <td>/change-request/:id/msg</td>
            <td>Create a message for requested change request id.</td>
          </tr>
          <tr>
            <td>DELETE</td>
            <td>/change-request/msg/:id</td>
            <td>Delete change request message by message id.</td>
          </tr>
          <tr>
            <td>GET</td>
            <td>/change-request/:id/hist</td>
            <td>Return history of requested change request id.</td>
          </tr>
          <tr>
            <td>POST</td>
            <td>/change-request/:id/msg</td>
            <td>Create a message for requested change request id.</td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script>
export default {};
</script>

<style>
</style>
