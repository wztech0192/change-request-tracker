<template>
  <div>
    <section class="content-header">
      <h2 style="font-weight:900">
        <i class="fa fa-link"></i>&nbsp;Web API Documation
      </h2>
    </section>
    <section class="content" style="overflow:auto">
      <p>
        <i class="fa fa-info-circle"></i> &nbsp;&nbsp;
        <i>Every route has a api prefix, for example: [/auth/register] -> [api/auth/register]</i>
      </p>
      <hr>
      <h3>
        Unauthenticated Routes
        <br>
        <small>The user is not expected to provide an ID token in each request header</small>
      </h3>
      <br>
      <div class="box box-default" v-for="route in norm_route">
        <div class="box-header">
          <label>Route:</label>
          <br>
          {{route.method}} {{route.route}}
        </div>
        <div class="box-body">
          <label>Description:&nbsp;&nbsp;</label>
          <br>
          {{route.description}}
        </div>
        <div v-if="route.body" class="box-footer">
          <label>Body:</label>
          <div
            class="box box-body"
            style="background-color: #f9f2f4;"
            v-html="bodyParse(route.body)"
          ></div>
        </div>
      </div>
      <br>
      <hr>
      <br>
      <h3>
        Authenticated Routes
        <br>
        <small>The user is expected and required to provide jwt token in each request header, or else the request will be denied</small>
      </h3>
      <br>
      <div class="box box-default" v-for="route in auth_route">
        <div class="box-header">
          <label>Route:</label>
          <br>
          {{route.method}} {{route.route}}
        </div>
        <div class="box-body">
          <label>Description:</label>
          <br>
          {{route.description}}
        </div>
        <div v-if="route.body" class="box-footer">
          <label>Body:</label>
          <div
            class="box box-body"
            style="background-color: #f9f2f4;"
            v-html="bodyParse(route.body)"
          ></div>
        </div>
      </div>
      <!--<table class="table table-border table-striped table-hover">
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
                <tr v-for="route in norm_route">
            <td>{{route.method}}</td>
            <td>{{route.route}}</td>
            <td>{{route.description}}</td>
            <td>{{route.body}}</td>
          </tr>
          </tr>
        </thead>
        <tbody>
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
          <tr v-for="route in auth_route">
            <td>{{route.method}}</td>
            <td>{{route.route}}</td>
            <td>{{route.description}}</td>
            <td>{{route.body}}</td>
          </tr>
        </tbody>
      </table>-->
    </section>
  </div>
</template> <script>
export default {
  data() {
    return {
      norm_route: [
        {
          method: 'POST',
          route: '/auth/register',
          description: 'Register a user account',
          body:
            '  "email", "password", "code", "first_name", "mid_initial, "last_name"  '
        },
        {
          method: 'POST',
          route: '/auth/login',
          description: 'Login user account. Return the user ID token',
          body: '  "email", "password"  '
        },
        {
          method: 'GET',
          route: '/regist-code/verify/:code',
          description:
            'Validate if the registration code exist in the CRT database',
          body: null
        },
        {
          method: 'POST',
          route: '/change-request/mail-submit/:key',
          description: 'Take incoming emails from Mailgun service',
          body: ' Mail_JSON '
        },
        {
          method: 'POST',
          route: '/change-request/mail-request-info/:key',
          description:
            'Process request from email and return change request information',
          body: ' Mail_JSON '
        }
      ],
      auth_route: [
        {
          method: 'GET',
          route: '/util/flag',
          description:
            'Return list of a flagged item owned by the current user (e.g. flagged change request)',
          body: null
        },
        {
          method: 'GET',
          route: '/util/notification',
          description:
            'Return all unread notifications and notifications from the last 3 days of the current user',
          body: null
        },
        {
          method: 'GET',
          route: '/util/msg',
          description:
            'Return all unread and marked messages of the current user',
          body: null
        },
        {
          method: 'POST',
          route: '/util/notification/paginate',
          description:
            'Return paginated notifications list of the current user. Used in notification datatable',
          body: ' DataTable_JSON '
        },
        {
          method: 'PATCH',
          route: '/util/notification/clear-new/:target',
          description: 'Set the select notification from unread to read',
          body: null
        },
        {
          method: 'GET',
          route: '/user',
          description: 'Return information of current user',
          body: null
        },

        {
          method: 'GET',
          route: '/user/:email',
          description: 'Return a user by email',
          body: null
        },
        {
          method: 'POST',
          route: '/user/search/:role',
          description: 'Return list of users filtered by the search data',
          body: '  "term", "page"  '
        },
        {
          method: 'POST',
          route: '/user/datatable',
          description:
            'Return list of users. Used to perform datatable server process',
          body: ' DataTable_JSON '
        },
        {
          method: 'DELETE',
          route: '/user/:id',
          description: 'Delete user by id',
          body: null
        },
        {
          method: 'PATCH',
          route: '/user/:id',
          description: 'Update user by id',
          body: ' "role": "Client || Admin || Developer" '
        },
        {
          method: 'POST',
          route: '/regist-code',
          description: 'Create new registration code',
          body:
            '  "allowEdit", "content", "email", "first_name", "last_name", "mid_initial", "role": "Developer || Admin || Client"  '
        },
        {
          method: 'GET',
          route: '/message/:id',
          description: 'Return message by id',
          body: null
        },
        {
          method: 'POST',
          route: '/message/list',
          description:
            'Return all message of the current user in the paginated formula',
          body:
            '  "limit", "page", "search", "type": "inbox || sent || archive"  '
        },
        {
          method: 'POST',
          route: '/message',
          description: 'Create new message',
          body: '  "content", "title", "receiver": "[ "Name (Email)" ]"  '
        },
        {
          method: 'PATCH',
          route: '/message/clear-new',
          description: 'Mark the message as read',
          body: null
        },
        {
          method: 'PATCH',
          route: '/message/archive',
          description: 'Toggle the message archive status',
          body: '  "isArchived", "list"  '
        },
        {
          method: 'PATCH',
          route: '/message/:id',
          description: 'Update message by id',
          body: '  "isRead", "isArchived", "isBookmark"  '
        },
        {
          method: 'POST',
          route: '/change-request/list',
          description:
            'Return change request list of the current user filtered by request tabs',
          body:
            '  "method": "tab", "tab": "active || all || Cancelled || To Do || In Progress || Complete"  '
        },
        {
          method: 'POST',
          route: '/change-request/admin/list',
          description:
            'Return all change request in the system and filter by the request',
          body:
            '  "method", "date", "id", "clientsName": "[ Name ]", "status": "Cancelled || To Do || In Progress || Complete", "tab": "active || all || Cancelled || To Do || In Progress || Complete"  '
        },
        {
          method: 'GET',
          route: '/change-request/chart/:range',
          description:
            'Return change request status ratio of requested date range. Used in ChartJS',
          body: null
        },
        {
          method: 'GET',
          route: '/change-request/:id',
          description: 'Return change request by id',
          body: null
        },
        {
          method: 'POST',
          route: '/change-request/',
          description: 'Create new change request',
          body: '  "client", "message", "details", "title"  '
        },
        {
          method: 'PATCH',
          route: '/change-request/:id',
          description: 'Update change request content by id',
          body:
            '  "status": "Cancelled || To Do || In Progress || Complete", "details", "title"  '
        },
        {
          method: 'POST',
          route: '/change-request/search/:target',
          description:
            'Return list of change requests filtered by the search data',
          body: '  "term", "page"  '
        },
        {
          method: 'DELETE',
          route: '/change-request/:id/unflag',
          description: 'Delete change request in flagged list',
          body: null
        },
        {
          method: 'POST',
          route: '/change-request/:id/flag',
          description: 'Add change request into flag list',
          body: null
        },
        {
          method: 'GET',
          route: '/change-request/:id/msg/:num',
          description:
            'Return requested number of messages in requested change request id',
          body: null
        },
        {
          method: 'POST',
          route: '/change-request/:id/msg',
          description: 'Create a message for a change request',
          body: '  "content"  '
        },
        {
          method: 'DELETE',
          route: '/change-request/msg/:id',
          description: 'Delete change request message by message id',
          body: null
        },
        {
          method: 'GET',
          route: '/change-request/:id/hist',
          description: 'Return history of requested change request id',
          body: null
        },
        {
          method: 'GET',
          route: '/dev',
          description: 'Return all developer to-do groups',
          body: null
        },
        {
          method: 'POST',
          route: '/dev/todo',
          description: 'Create new to-do group',
          body: '  "content", ",description"  '
        },
        {
          method: 'DELETE',
          route: '/dev/todo/:id',
          description: 'Delete to-do group by id',
          body: null
        },
        {
          method: 'PATCH',
          route: '/dev/todo/:id',
          description: 'Update to-do group by id',
          body: '  "content"  '
        },
        {
          method: 'POST',
          route: '/dev/todo/:id/task',
          description: 'Add a task to to-do group by id',
          body: '  "content", ",description"  '
        },
        {
          method: 'DELETE',
          route: '/dev/task/:id',
          description: 'Delete task by id',
          body: null
        },
        {
          method: 'PATCH',
          route: '/dev/task/:id',
          description: 'Update task by id',
          body: ' "content" '
        },
        {
          method: 'PATCH',
          route: '/dev/task/complete/:id',
          description: 'Set task to complete',
          body: '  "isCompleted"  '
        },
        {
          method: 'DELETE',
          route: '/dev/todo/:id',
          description: 'Delete to-do group',
          body: null
        },
        {
          method: 'GET',
          route: '/test/generate/user/:num',
          description: 'Generate number of dummy users',
          body: null
        },
        {
          method: 'GET',
          route: '/test/generat/cr/:num',
          description: 'Generate number of dummy change requests',
          body: null
        },
        {
          method: 'GET',
          route: '/test/correctCR',
          description:
            'Refresh change request data field after the data got mess up by testing',
          body: null
        }
      ]
    };
  },
  methods: {
    bodyParse(str) {
      var split = str.trim().split(', ');
      var html = '';

      for (var s of split) {
        html += ',<br>&nbsp;&nbsp;&nbsp;' + s;
      }
      return `<code>{<br>${html.substring(5)}<br>}</code>`;
    }
  }
};
</script>
 <style>
code {
  padding: 0 !important;
}
</style>