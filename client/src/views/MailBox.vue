<template>
  <!-- Content Wrapper. Contains page content -->
  <div>
    <!-- Content Header (Page header) -->
    <section class="content-header">
      <h1>
        <i class="fa fa-envelope"></i>&nbsp;Mailbox
        <small>13 new messages</small>
      </h1>
    </section>

    <!-- Main content -->
    <section class="content">
      <div class="row">
        <div class="col-md-3">
          <a @click="displayComposeModal" class="btn btn-primary btn-block margin-bottom">Compose</a>

          <div class="box box-solid">
            <div class="box-header with-border">
              <h3 class="box-title">Folders</h3>
            </div>
            <div class="box-body no-padding">
              <ul class="nav nav-pills nav-stacked">
                <li :class="{'active':filter.type === 'inbox'}">
                  <a @click="changeFilterType('inbox')">
                    <i class="fa fa-inbox"></i> Inbox
                    <span class="label label-primary pull-right">{{msgList.length}}</span>
                  </a>
                </li>
                <li :class="{'active':filter.type === 'sent'}">
                  <a @click="changeFilterType('sent')">
                    <i class="fa fa-envelope-o"></i> Sent
                  </a>
                </li>

                <li :class="{'active':filter.type === 'archive'}">
                  <a @click="changeFilterType('archive')">
                    <i class="fa fa-filter"></i>
                    Archive
                  </a>
                </li>
              </ul>
            </div>
            <!-- /.box-body -->
          </div>
        </div>
        <!-- /.col -->
        <div class="col-md-9">
          <div class="box box-primary">
            <div class="box-header with-border">
              <h3 class="box-title capitalize">{{filter.type}}</h3>

              <div class="box-tools pull-right">
                <div class="has-feedback">
                  <input
                    type="text"
                    class="form-control input-sm"
                    placeholder="Search Mail"
                    v-model="filter.search"
                    @keyup="searchDelay"
                  >
                  <span class="glyphicon glyphicon-search form-control-feedback"></span>
                </div>
              </div>
              <!-- /.box-tools -->
            </div>
            <!-- /.box-header -->
            <div v-if="hasMessage()" class="box-body no-padding" style="min-height:400px;">
              <div v-if="loading" class="overlay">
                <i class="fa fa-spinner fa-spin"></i>
              </div>
              <div class="mailbox-controls">
                <!-- Check all button -->
                <button
                  type="button"
                  class="btn btn-default btn-sm checkbox-toggle"
                  @click="toggleCheckBox"
                >
                  <i class="fa" :class="checkAll?'fa-check-square-o':'fa-square-o'"></i>
                </button>
                <div class="btn-group" style="margin:0 5px;">
                  <button
                    v-if="filter.type!=='sent'"
                    type="button"
                    class="btn btn-default btn-sm"
                    @click="toggleArchive"
                  >
                    <i class="fa" :class="filter.type==='inbox'?'fa-archive':'fa-undo'"></i>
                  </button>
                  <button
                    type="button"
                    class="btn btn-default btn-sm"
                    @click="validateBeforeFR(true)"
                  >
                    <i class="fa fa-reply"></i>
                  </button>
                  <button
                    type="button"
                    class="btn btn-default btn-sm"
                    @click="validateBeforeFR(false)"
                  >
                    <i class="fa fa-share"></i>
                  </button>
                </div>

                <!-- /.btn-group -->
                <button type="button" class="btn btn-default btn-sm" @click="fetchMessageList">
                  <i class="fa fa-refresh"></i>
                </button>
                <div class="pull-right">
                  {{pageData.start}}-{{pageData.end}}/{{pageData.total}}
                  <div class="btn-group">
                    <button type="button" class="btn btn-default btn-sm" @click="changePage(-1)">
                      <i class="fa fa-chevron-left"></i>
                    </button>
                    <button type="button" class="btn btn-default btn-sm" @click="changePage(1)">
                      <i class="fa fa-chevron-right"></i>
                    </button>
                  </div>
                  <!-- /.btn-group -->
                </div>
                <!-- /.pull-right -->
              </div>
              <div v-if="hasMessage() && !loading" class="table-responsive mailbox-messages">
                <table id="msg-table" class="table table-hover table-striped">
                  <tbody>
                    <tr v-for="(msg, i) in pageData.data">
                      <td>
                        <input type="checkbox" :value="i">
                      </td>
                      <td v-if="filter.type!=='sent'" class="mailbox-star">
                        <a @click="toggleStar(msg)">
                          <i class="fa text-yellow" :class="msg.isStar===0 ?'fa-star-o ':'fa-star'"></i>
                        </a>
                      </td>
                      <td class="mailbox-name">
                        <a @click>{{filter.type==='sent'? msg.receiverEmail :msg.senderName}}</a>
                      </td>

                      <td class="mailbox-subject" :class="{'bold':msg.isRead === 0}">{{msg.title}}</td>
                      <td
                        class="mailbox-date"
                      >{{calculateTimeElapsed(msg.created_at ,[' mins ago', ' hours ago', ' days ago'])}}</td>
                    </tr>
                  </tbody>
                </table>
                <!-- /.table -->
              </div>

              <!-- /.mail-box-messages -->
            </div>
            <!-- /.box-body -->
            <div v-if="hasMessage()" class="box-footer no-padding">
              <div class="mailbox-controls">
                <!-- Check all button -->
                <button
                  type="button"
                  class="btn btn-default btn-sm checkbox-toggle"
                  @click="toggleCheckBox"
                >
                  <i class="fa" :class="checkAll?'fa-check-square-o':'fa-square-o'"></i>
                </button>

                <div class="btn-group" style="margin:0 5px;">
                  <button
                    v-if="filter.type!=='sent'"
                    type="button"
                    class="btn btn-default btn-sm"
                    @click="toggleArchive"
                  >
                    <i class="fa" :class="filter.type==='inbox'?'fa-archive':'fa-undo'"></i>
                  </button>
                  <button
                    type="button"
                    class="btn btn-default btn-sm"
                    @click="validateBeforeFR(true)"
                  >
                    <i class="fa fa-reply"></i>
                  </button>
                  <button
                    type="button"
                    class="btn btn-default btn-sm"
                    @click="validateBeforeFR(false)"
                  >
                    <i class="fa fa-share"></i>
                  </button>
                </div>

                <!-- /.btn-group -->
                <button type="button" class="btn btn-default btn-sm" @click="fetchMessageList">
                  <i class="fa fa-refresh"></i>
                </button>
                <div class="pull-right">
                  {{pageData.start}}-{{pageData.end}}/{{pageData.total}}
                  <div class="btn-group">
                    <button type="button" class="btn btn-default btn-sm" @click="changePage(-1)">
                      <i class="fa fa-chevron-left"></i>
                    </button>
                    <button type="button" class="btn btn-default btn-sm" @click="changePage(1)">
                      <i class="fa fa-chevron-right"></i>
                    </button>
                  </div>
                  <!-- /.btn-group -->
                </div>
                <!-- /.pull-right -->
              </div>
            </div>
            <div v-else>
              <h3 class="text-center" style="padding:100px 0;">No message available</h3>
            </div>
          </div>
          <!-- /. box -->
        </div>
        <!-- /.col -->
      </div>
      <!-- /.row -->
    </section>
    <!-- /.content -->
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import HTTP from '@/http';
import helper from '@/mixin/helper';
import rowEvent from '@/mixin/rowEvent';

export default {
  mixins: [helper, rowEvent],

  data() {
    return {
      filter: {
        type: 'inbox',
        page: 1,
        limit: 20,
        search: ''
      },
      pageData: {},
      checkAll: false,
      delayTimer: null
    };
  },
  created() {
    //intialize inbox message data.
    this.fetchMessageList();
  },

  computed: {
    ...mapState('userStore', ['msgList'])
  },

  watch: {
    // refresh data if header message menu data changed
    msgList() {
      this.fetchMessageList();
    }
  },

  methods: {
    ...mapActions('errorStore', ['setGlobalError']),

    //delay typing search
    searchDelay() {
      //clear existing timer
      if (this.delayTimer !== null) {
        clearTimeout(this.delayTimer);
      }
      //set new timer
      this.delayTimer = setTimeout(() => {
        this.fetchMessageList();
      }, 200);
    },

    // retrieve message list from server
    fetchMessageList() {
      this.loading = true;

      HTTP()
        .post('message/list', this.filter)
        .then(({ data }) => {
          this.pageData = data;
          this.loading = false;
          setTimeout(() => {
            this.addRowSelectEvent('#msg-table', target => {
              // tr > td > input[type= 'checkbox']  > value = index
              const index = target.firstChild.firstChild.value;
              this.$modal.show('read-msg', this.pageData.data[index]);
            });
          }, 10);
        })
        .catch(e => {
          this.setGlobalError(e);
        });
    },

    //change filter type, then fetch list again
    changeFilterType(type) {
      this.filter.type = type;
      this.filter.page = 1;
      this.checkAll = false;
      this.fetchMessageList();
    },

    //change page, then fetch list again
    changePage(page) {
      const newPage = this.filter.page + page;
      if (newPage > 0 && newPage <= this.pageData.lastPage) {
        this.filter.page = newPage;
        this.fetchMessageList();
      }
    },

    //check if message is empty or not
    hasMessage() {
      return this.pageData.data && this.pageData.data.length > 0;
    },

    //toggle all checkbox
    toggleCheckBox() {
      this.checkAll = !this.checkAll;
      this.$el
        .querySelectorAll('.mailbox-messages input[type="checkbox"]')
        .forEach(cb => (cb.checked = this.checkAll));
    },

    //toggle message star
    toggleStar(msg) {
      msg.isStar = msg.isStar === 0 ? 1 : 0;
      //update the server
      HTTP()
        .patch(`message/${msg.id}`, { isStar: msg.isStar })
        .catch(e => {
          this.setGlobalError(e);
        });
    },

    //archive all checked message
    toggleArchive() {
      const cb = this.$el.querySelectorAll(
        '.mailbox-messages input[type="checkbox"]:checked'
      );

      //make sure at least one message has been checked. Alert if none.
      if (cb.length <= 0) {
        this.displayNoSelectionAlert('Please check one message check box.');
      } else {
        var list = new Array(cb.length);
        //store msg id into msg list
        for (var i = 0; i < list.length; i++) {
          list[i] = this.pageData.data[cb[i].value].id;
        }

        //send http request to the server and refresh list
        HTTP()
          .patch('message/archive', {
            list,
            isArchived: this.filter.type === 'inbox'
          })
          .then(() => {
            this.fetchMessageList();
          })
          .catch(e => {
            this.setGlobalError(e);
          });
      }
    },

    //display compose modal
    displayComposeModal() {
      this.$modal.show('compose-msg');
    },

    //validate if user has select only one message before forwarding or replying message
    validateBeforeFR(isReply) {
      const cb = this.$el.querySelectorAll(
        '.mailbox-messages input[type="checkbox"]:checked'
      );

      // forward or reply when there is only one message checked
      if (cb.length === 1) {
        try {
          const msg = this.pageData.data[cb[0].value];
          if (isReply) {
            this.replyMSG(msg);
          } else {
            this.forwardMSG(msg);
          }
        } catch (e) {
          this.setGlobalError(e);
        }
      } else {
        //alert user when there is 0 checked message or more than 1 checked message
        let alert;
        if (cb.length <= 0) {
          this.displayNoSelectionAlert('Please check one message check box.');
        } else if (cb.length > 1) {
          this.displayNoSelectionAlert(
            'Action can only be performed when there is only one checked message.'
          );
        }
      }
    },

    //alert when user did not select check box
    displayNoSelectionAlert(alert) {
      // display no selection error massage
      this.$modal.show('dialog', {
        title:
          "<span class='text-yellow'><i class='fa fa-exclamation-triangle'></i> Alert! </span>",
        template: `<h4 style='text-align:center;'>${alert}</h4>`,
        maxWidth: 400,
        buttons: [
          {
            title: 'Ok',
            default: true
          }
        ]
      });
    }
  }
};
</script>

<style>
.mailbox-messages input[type='checkbox'] {
  margin-left: 7px;
}

#msg-table .selected {
  background-color: lightgrey !important;
}
</style>
