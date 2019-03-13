<template>
  <div>
    <section class="content-header">
      <h1>
        <i class="fa fa-arrow-circle-right"></i>&nbsp;Page Routes
      </h1>
    </section>
    <section class="content">
      <table id="routes-table" class="table table-bordered table-striped table-hover">
        <thead>
          <tr>
            <th>Route</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <router-link to="/login">/login</router-link>
            </td>
            <td>Login page where the user can enter their username and password to enter the site or enter a registration code to access register page.</td>
          </tr>
          <tr>
            <td>
              <router-link to="/register">/register</router-link>
            </td>
            <td>Register page where the user can fill in information to register an account.</td>
          </tr>
          <tr>
            <td>
              <router-link to="/">/</router-link>
            </td>
            <td>Default page when the user logins. The page displays dashboard to the user.</td>
          </tr>
          <tr>
            <td>
              <router-link to="/mailbox">/mailbox</router-link>
            </td>
            <td>Mailbox page where users can review all received or sent messages. The user is also able to compose a new message on this page.</td>
          </tr>
          <tr>
            <td>
              <router-link to="/notification">/notification</router-link>
            </td>
            <td>The page that displays all notifications for the current user.</td>
          </tr>
          <tr>
            <td>
              <router-link to="/contact">/contact</router-link>
            </td>
            <td>The page that displays contact methods.</td>
          </tr>
          <tr>
            <td>
              <router-link to="/about">/about</router-link>
            </td>
            <td>Display information of the developer.</td>
          </tr>
          <tr>
            <td>
              <router-link to="/document/web-api">/document/web-api</router-link>
            </td>
            <td>Display all api routes used in this system.</td>
          </tr>
          <tr>
            <td>
              <router-link to="/document/page-routes">/document/page-routes</router-link>
            </td>
            <td>Display all routes used in this website.</td>
          </tr>
          <tr>
            <td>
              <router-link to="/dev/todo">/dev/todo</router-link>
            </td>
            <td>Developer To-Do page. Only developers are allowed to enter. Display all developer to-do tasks.</td>
          </tr>
          <tr>
            <td>
              <router-link to="/dev/tool">/dev/tool</router-link>
            </td>
            <td>Only developers are allowed to enter. The page is a place where a developer can generate dummy data or perform testing.</td>
          </tr>
          <tr>
            <td>
              <router-link to="/admin/user-list">/admin/user-list</router-link>
            </td>
            <td>Only admins are allowed to enter. The page is a place where admin manages all users and make changes to the client account.</td>
          </tr>
          <tr>
            <td>
              <router-link to="/admin/chart">/admin/chart</router-link>
            </td>
            <td>Only admins are allowed to enter. The page will display the change request status ratio in the selected week.</td>
          </tr>
          <tr>
            <td>
              <router-link to="/admin/generate-code">/admin/generate-code</router-link>
            </td>
            <td>Only admins are allowed to enter. The page allows admin to create a new registration code by filling out the form.</td>
          </tr>
          <tr>
            <td>
              <router-link to="/admin/change-request">/admin/change-request</router-link>
            </td>
            <td>Only admins are allowed to enter this page. The page displays all change requests in the system.</td>
          </tr>
          <tr>
            <td>
              <router-link to="/admin/change-request/search">/admin/change-request/search</router-link>
            </td>
            <td>Only admins are allowed to enter this page. The page allows admin to search change request by entering date range, request id, client name, or request status. The page also displays a table of the result.</td>
          </tr>
          <tr>
            <td>
              <router-link to="/change-request/entry">/change-request/entry</router-link>
            </td>
            <td>The page where the client or admin can fill out a form to create a change request.</td>
          </tr>
          <tr>
            <td>
              <router-link to="/change-request">/change-request</router-link>
            </td>
            <td>The page displays all change requests owned by the current user.</td>
          </tr>
          <tr>
            <td>
              <router-link to="/change-request/0">/change-request/:id</router-link>
            </td>
            <td>The page displays change request detail. Only admins or the request owner can enter this page.</td>
          </tr>
          <tr>
            <td>
              <router-link to="/change-request/0/content">/change-request/:id/content</router-link>
            </td>
            <td>The nested page that displays the selected change request title and detail. Admin is able to modify request title and detail under this page.</td>
          </tr>
          <tr>
            <td>
              <router-link to="/change-request/0/message">/change-request/:id/message</router-link>
            </td>
            <td>The nested page that displays the selected change request messages. Client and admin are able to interact with each other by sending messages on this page.</td>
          </tr>
          <tr>
            <td>
              <router-link to="/change-request/0/history">/change-request/:id/history</router-link>
            </td>
            <td>The nested page that displays the selected change request history.</td>
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
#routes-table td:first-child {
  white-space: nowrap;
}
</style>
