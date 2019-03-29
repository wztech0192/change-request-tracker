<template>
  <div>
    <section class="content-header">
      <h1>
        <i class="fa fa-link"></i>&nbsp;Web API Documation
      </h1>
    </section>
    <section class="content" style="overflow:auto">
      <p>
        <i class="fa fa-info-circle"></i>
        <i>
          Every route has a api prefix,
          for example: [/auth/register] -> [api/auth/register]
        </i>
      </p>
      <hr>
      <table class="table table-border table-striped table-hover">
        <thead>
          <tr>
            <th colspan="4">
              <h3>
                Unauthenticated Routes
                <br>
                <small>The user is not expected to provide an ID token in each request header</small>
              </h3>
            </th>
          </tr>
          <tr>
            <th>Meth</th>
            <th>Route</th>
            <th>Purpose</th>
            <th>Body</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>POST</td>
            <td>/auth/register</td>
            <td>Register a user account</td>
            <td>
              <code>
                {
                "email",
                "password",
                "code",
                "first_name",
                "mid_initial,
                "last_name"
                }
              </code>
            </td>
          </tr>
          <tr>
            <td>POST</td>
            <td>/auth/login</td>
            <td>Login user account. Return the user ID token</td>

            <td>
              <code>
                {
                "email",
                "password"
                }
              </code>
            </td>
          </tr>
          <tr>
            <td>GET</td>
            <td>/regist-code/verify/:code</td>
            <td>Validate if the registration code exist in the CRT database</td>

            <td>
              <code>Empty</code>
            </td>
          </tr>
          <tr>
            <td>POST</td>
            <td>/change-request/mail-submit/:key</td>
            <td>Take incoming emails from Mailgun service</td>

            <td>
              <code>{ Mail_JSON }</code>
            </td>
          </tr>
          <tr>
            <td>POST</td>
            <td>/change-request/mail-request-info/:key</td>
            <td>Process request from email and return change request information</td>

            <td>
              <code>{ Mail_JSON }</code>
            </td>
          </tr>
          <tr>
            <th colspan="4">
              <h3>
                Authenticated Routes
                <br>
                <small>The user is expected and required to provide jwt token in each request header, or else the request will be denied</small>
              </h3>
            </th>
          </tr>

          <tr>
            <th>Meth</th>
            <th>Route</th>
            <th>Purpose</th>
            <th>Body</th>
          </tr>

          <tr>
            <td>GET</td>
            <td>/user</td>
            <td>Return information of current user</td>
            <td>
              <code>Empty</code>
            </td>
          </tr>
          <tr>
            <td>GET</td>
            <td>/user/flag</td>
            <td>Return list of a flagged item owned by the current user (e.g. flagged change request)</td>
            <td>
              <code>Empty</code>
            </td>
          </tr>
          <tr>
            <td>GET</td>
            <td>/user/notification</td>
            <td>Return all unread notifications and notifications from the last 3 days of the current user</td>
            <td>
              <code>Empty</code>
            </td>
          </tr>
          <tr>
            <td>GET</td>
            <td>/user/msg</td>
            <td>Return all unread and marked messages of the current user</td>
            <td>
              <code>Empty</code>
            </td>
          </tr>
          <tr>
            <td>POST</td>
            <td>/user/notification/paginate</td>
            <td>Return paginated notifications list of the current user. Used in notification datatable</td>

            <td>
              <code>{ DataTable_JSON }</code>
            </td>
          </tr>
          <tr>
            <td>PATCH</td>
            <td>/user/notification/clear-new/:target</td>
            <td>Set the select notification from unread to read</td>
            <td>
              <code>Empty</code>
            </td>
          </tr>
          <tr>
            <td>GET</td>
            <td>/user/:email</td>
            <td>Return a user by email</td>
            <td>
              <code>Empty</code>
            </td>
          </tr>
          <tr>
            <td>POST</td>
            <td>/user/search/:role</td>
            <td>Return list of users filtered by the search data</td>

            <td>
              <code>
                {
                "term",
                "page"
                }
              </code>
            </td>
          </tr>
          <tr>
            <td>POST</td>
            <td>/user/datatable</td>
            <td>Return list of users. Used to perform datatable server process</td>

            <td>
              <code>{ DataTable_JSON }</code>
            </td>
          </tr>
          <tr>
            <td>DELETE</td>
            <td>/user/:id</td>
            <td>Delete user by id</td>
            <td>
              <code>Empty</code>
            </td>
          </tr>
          <tr>
            <td>PATCH</td>
            <td>/user/:id</td>
            <td>Update user by id</td>

            <td>
              <code>{ "role": "Client || Admin || Developer" }</code>
            </td>
          </tr>
          <tr>
            <td>POST</td>
            <td>/regist-code</td>
            <td>Create new registration code</td>

            <td>
              <code>
                {
                "allowEdit",
                "content",
                "email",
                "first_name",
                "last_name",
                "mid_initial",
                "role": "Developer || Admin || Client"
                }
              </code>
            </td>
          </tr>

          <tr>
            <td>GET</td>
            <td>/message/:id</td>
            <td>Return message by id</td>
            <td>
              <code>Empty</code>
            </td>
          </tr>

          <tr>
            <td>POST</td>
            <td>/message/list</td>
            <td>Return all message of the current user in the paginated formula</td>

            <td>
              <code>
                {
                "limit",
                "page",
                "search",
                "type": "inbox || sent || archive"
                }
              </code>
            </td>
          </tr>
          <tr>
            <td>POST</td>
            <td>/message</td>
            <td>Create new message</td>

            <td>
              <code>
                {
                "content",
                "title",
                "receiver": "[ "Name (Email)" ]"
                }
              </code>
            </td>
          </tr>

          <tr>
            <td>PATCH</td>
            <td>/message/clear-new</td>
            <td>Mark the message as read</td>

            <td>
              <code>Empty</code>
            </td>
          </tr>
          <tr>
            <td>PATCH</td>
            <td>/message/archive</td>
            <td>Toggle the message archive status</td>

            <td>
              <code>
                {
                "isArchived",
                "list"
                }
              </code>
            </td>
          </tr>
          <tr>
            <td>PATCH</td>
            <td>/message/:id</td>
            <td>Update message by id</td>

            <td>
              <code>
                {
                "isRead",
                "isArchived",
                "isBookmark"
                }
              </code>
            </td>
          </tr>
          <tr>
            <td>POST</td>
            <td>/change-request/list</td>
            <td>Return change request list of the current user filtered by request tabs</td>

            <td>
              <code>
                {
                "method": "tab",
                "tab": "active || all || Cancelled || To Do || In Progress || Complete"
                }
              </code>
            </td>
          </tr>
          <tr>
            <td>POST</td>
            <td>/change-request/admin/list</td>
            <td>Return all change request in the system and filter by the request</td>

            <td>
              <code>
                {
                "method",
                "date",
                "id",
                "clientsName": "[ Name ]",
                "status": "Cancelled || To Do || In Progress || Complete",
                "tab": "active || all || Cancelled || To Do || In Progress || Complete"
                }
              </code>
            </td>
          </tr>
          <tr>
            <td>GET</td>
            <td>/change-request/chart/:range</td>
            <td>Return change request status ratio of requested date range. Used in ChartJS</td>
            <td>
              <code>Empty</code>
            </td>
          </tr>

          <tr>
            <td>GET</td>
            <td>/change-request/:id</td>
            <td>Return change request by id</td>

            <td>
              <code>Empty</code>
            </td>
          </tr>
          <tr>
            <td>POST</td>
            <td>/change-request/</td>
            <td>Create new change request</td>
            <td>
              <code>
                {
                "client",
                "message",
                "details",
                "title"
                }
              </code>
            </td>
          </tr>

          <tr>
            <td>PATCH</td>
            <td>/change-request/:id</td>
            <td>Update change request content by id</td>

            <td>
              <code>
                {
                "status": "Cancelled || To Do || In Progress || Complete",
                "details",
                "title"
                }
              </code>
            </td>
          </tr>

          <tr>
            <td>POST</td>
            <td>/change-request/search/:target</td>
            <td>Return list of change requests filtered by the search data</td>
            <td>
              <code>
                {
                "term",
                "page"
                }
              </code>
            </td>
          </tr>
          <tr>
            <td>DELETE</td>
            <td>/change-request/:id/unflag</td>
            <td>Delete change request in flagged list</td>

            <td>
              <code>Empty</code>
            </td>
          </tr>
          <tr>
            <td>POST</td>
            <td>/change-request/:id/flag</td>
            <td>Add change request into flag list</td>

            <td>
              <code>Empty</code>
            </td>
          </tr>
          <tr>
            <td>GET</td>
            <td>/change-request/:id/msg/:num</td>
            <td>Return requested number of messages in requested change request id</td>

            <td>
              <code>Empty</code>
            </td>
          </tr>
          <tr>
            <td>POST</td>
            <td>/change-request/:id/msg</td>
            <td>Create a message for a change request</td>

            <td>
              <code>
                {
                "content"
                }
              </code>
            </td>
          </tr>
          <tr>
            <td>DELETE</td>
            <td>/change-request/msg/:id</td>
            <td>Delete change request message by message id</td>

            <td>
              <code>Empty</code>
            </td>
          </tr>
          <tr>
            <td>GET</td>
            <td>/change-request/:id/hist</td>
            <td>Return history of requested change request id</td>

            <td>
              <code>Empty</code>
            </td>
          </tr>

          <tr>
            <td>GET</td>
            <td>/dev</td>
            <td>Return all developer to-do groups</td>

            <td>
              <code>Empty</code>
            </td>
          </tr>
          <tr>
            <td>POST</td>
            <td>/dev/todo</td>
            <td>Create new to-do group</td>

            <td>
              <code>
                {
                "content",
                "description"
                }
              </code>
            </td>
          </tr>
          <tr>
            <td>DELETE</td>
            <td>/dev/todo/:id</td>
            <td>Delete to-do group by id</td>

            <td>
              <code>Empty</code>
            </td>
          </tr>
          <tr>
            <td>PATCH</td>
            <td>/dev/todo/:id</td>
            <td>Update to-do group by id</td>

            <td>
              <code>
                {
                "content"
                }
              </code>
            </td>
          </tr>
          <tr>
            <td>POST</td>
            <td>/dev/todo/:id/task</td>
            <td>Add a task to to-do group by id</td>

            <td>
              <code>
                {
                "content",
                "description"
                }
              </code>
            </td>
          </tr>
          <tr>
            <td>DELETE</td>
            <td>/dev/task/:id</td>
            <td>Delete task by id</td>

            <td>
              <code>Empty</code>
            </td>
          </tr>
          <tr>
            <td>PATCH</td>
            <td>/dev/task/:id</td>
            <td>Update task by id</td>

            <td>
              <code>{ "content" }</code>
            </td>
          </tr>
          <tr>
            <td>PATCH</td>
            <td>/dev/task/complete/:id</td>
            <td>Set task to complete</td>

            <td>
              <code>
                {
                "isCompleted"
                }
              </code>
            </td>
          </tr>
          <tr>
            <td>DELETE</td>
            <td>/dev/todo/:id</td>
            <td>Delete to-do group</td>

            <td>
              <code>Empty</code>
            </td>
          </tr>
          <tr>
            <td>GET</td>
            <td>/test/generate/user/:num</td>
            <td>Generate number of dummy users</td>

            <td>
              <code>Empty</code>
            </td>
          </tr>
          <tr>
            <td>GET</td>
            <td>/test/generat/cr/:num</td>
            <td>Generate number of dummy change requests</td>

            <td>
              <code>Empty</code>
            </td>
          </tr>
          <tr>
            <td>GET</td>
            <td>/test/correctCR</td>
            <td>Refresh change request data field after the data got mess up by testing</td>

            <td>
              <code>Empty</code>
            </td>
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
