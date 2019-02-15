<template>
  <div v-if="todoList">
    <section class="content">
      <!-- Custom Tabs (Pulled to the right) -->
      <div class="nav-tabs-custom">
        <ul class="nav nav-tabs pull-right">
          <li :class="{'active':todoType==='COMPLETE'}">
            <a
              @click.prevent="setTodoType('COMPLETE')"
              data-toggle="tab"
              aria-expanded="false"
            >Completed</a>
          </li>
          <li :class="{'active':todoType==='FLAG'}">
            <a @click="setTodoType('FLAG')" data-toggle="tab" aria-expanded="false">Flagged</a>
          </li>
          <li :class="{'active':todoType==='ALL'}">
            <a @click="setTodoType('ALL')" data-toggle="tab" aria-expanded="true">All</a>
          </li>
          <!-- Add New ToDo Button  -->
          <a
            class="pull-right btn btn-app addTodoBtn"
            @click="showPromptModal(false, 'Create New Todo')"
          >
            <i class="fa fa-calendar-plus-o"></i> New Todo
          </a>
          <li class="pull-left header">
            <h2 style="padding:0; margin:0;">
              <i class="fa fa-th"></i>&nbsp;&nbsp;Developer Todo List
              <small>on progress</small>
            </h2>
          </li>
        </ul>
        <div class="tab-content">
          <div class="tab-pane active">
            <transition-group name="list" tag="p">
              <!-- Loop and display all todo -->
              <div
                :style="[ todoFilter(todo) ? {'display':'none'} : {'display':'block'}] "
                class="box box-widget box-solid box-default collapsed-box"
                data-widget="box-widget"
                v-for="(todo, i) in todoList"
                :key="todo.id"
              >
                <div
                  class="box-header with-border todo-header"
                  style="padding-left:30px;"
                  :class="{'todo-flagged':todo.isFlagged}"
                >
                  <div
                    class="box-tools pull-left"
                    style="margin-left:-25px; position:relative;top:0; right:0;"
                  >
                    <button class="btn btn-box-tool" data-widget="collapse">
                      <i class="fa fa-plus"></i>
                    </button>
                  </div>

                  <!-- Todo Edit -->
                  <button
                    type="button"
                    class="pull-right btn btn-box-tool"
                    data-toggle="tooltip"
                    title="Edit"
                    @click="showPromptModal(true, 'Edit Todo #'+(i+1), todo)"
                  >
                    <i class="fa fa-edit"></i>
                  </button>

                  <!-- Todo Delete -->
                  <button
                    type="button"
                    class="pull-right btn btn-box-tool"
                    data-toggle="tooltip"
                    title="Delete"
                    @click="showConfirmModal('Are You Sure You Want To Permanently Remove This Todo?',todo)"
                  >
                    <i class="fa fa-trash"></i>
                  </button>

                  <!-- Task Add -->
                  <button
                    type="button"
                    class="pull-right btn btn-box-tool"
                    data-toggle="tooltip"
                    title="Add Task"
                    @click="showPromptModal(false, 'Create New Task For Todo #'+(i+1), todo)"
                  >
                    <i class="fa fa-plus-square"></i>
                  </button>

                  <!-- Todo Flag -->
                  <button
                    type="button"
                    class="pull-right btn btn-box-tool"
                    data-toggle="tooltip"
                    title="Flag"
                    @click="flagTodo(todo)"
                  >
                    <i v-if="!todo.isFlagged" class="fa fa-flag-o"></i>
                    <i v-else class="fa fa-flag" style="color:blue;"></i>
                  </button>

                  <!-- Todo Information -->
                  <button
                    type="button"
                    class="pull-right btn btn-box-tool"
                    data-toggle="tooltip"
                    data-html="true"
                    :data-original-title="getTodoInfo(todo)"
                  >
                    <i class="fa fa-info-circle"></i>
                  </button>

                  <h5
                    class="box-title"
                    style="font-size:100%; padding: 5px 0; display:inline;"
                  >{{todo.content}}</h5>

                  <div class="progress xxs active" style="width:100%; margin-bottom:0;">
                    <div
                      class="progress-bar progress-bar-primary progress-bar-striped"
                      :class="{'progress-bar-success':todo.percentage>=100}"
                      role="progressbar"
                      :style="{width: todo.percentage + '%' }"
                    ></div>
                  </div>
                </div>
                <div class="box-body" style="display:none; padding-left:30px;">
                  <transition-group name="list" tag="p">
                    <!-- Loop and display each task inside each todo -->
                    <div
                      v-for="task in todo.tasks"
                      class="devtask-style"
                      :class="{'devtask-completed':task.isCompleted}"
                      :key="task.id"
                    >
                      <!-- Task Completion -->
                      <button
                        type="button"
                        class="btn btn-box-tool"
                        style="margin-left: -20px;"
                        @click="setTaskCompleted({task:task, todo:todo})"
                      >
                        <i class="fa fa-square-o" :class="getCompletedClass(task.isCompleted)"></i>
                      </button>
                      <!-- Task Edit -->
                      <button
                        type="button"
                        class="pull-right btn btn-box-tool"
                        data-toggle="tooltip"
                        title="Edit"
                        @click="showPromptModal(true, 'Edit Task #'+(i+1), task, todo)"
                      >
                        <i class="fa fa-edit"></i>
                      </button>

                      <!-- Task Delete -->
                      <button
                        type="button"
                        class="pull-right btn btn-box-tool"
                        data-toggle="tooltip"
                        title="Delete"
                        @click="showConfirmModal('Are You Sure You Want To Permanently Remove This Task?',task, todo)"
                      >
                        <i class="fa fa-trash"></i>
                      </button>

                      <h5 style="display:inline;">{{task.content}}</h5>
                    </div>
                  </transition-group>
                </div>
              </div>
            </transition-group>
          </div>

          <!-- /.tab-pane -->
        </div>
        <!-- /.tab-content -->
      </div>
    </section>

    <!-- Input Modal -->
    <modal
      name="PromptModal"
      :adaptive="true"
      :scrollable="true"
      height="auto"
      width="80%"
      :max-width="400"
    >
      <div class="box box-primary" style="margin:0;">
        <div class="box-header with-border">
          <h3 class="box-title">{{modalInfo.description}}</h3>
        </div>
        <div class="box-body">
          <div class="form-group" :class="{'has-error':errorMsg}">
            <label v-if="errorMsg" class="control-label" for="inputError">
              <i class="fa fa-times-circle-o"></i>
              {{errorMsg}}
            </label>
            <textarea
              v-model="modalInfo.content"
              type="text"
              class="form-control"
              placeholder="Enter ..."
            ></textarea>
          </div>
        </div>
        <div class="box-footer">
          <button class="pull-right btn btn-primary" @click="modalInfo.btnEvent">Confirm</button>
          <button
            @click="$modal.hide('PromptModal')"
            class="pull-right btn btn-secondary"
            style="margin-right:10px"
          >Close</button>
        </div>
      </div>
    </modal>

    <!-- Confirm Modal -->
    <modal
      name="ConfirmModal"
      :adaptive="true"
      :scrollable="true"
      height="auto"
      width="80%"
      :max-width="400"
    >
      <div class="box box-primary" style="margin:0;">
        <div class="box-header with-border">
          <div class="alert-dismissible">
            <h4>
              <i class="icon fa fa-info"></i> Confirmation
            </h4>
            {{modalInfo.description}}
          </div>
        </div>
        <div class="box-footer">
          <button class="pull-right btn btn-primary" @click="modalInfo.btnEvent">Remove</button>
          <button
            @click="$modal.hide('ConfirmModal')"
            class="pull-right btn btn-secondary"
            style="margin-right:10px"
          >Close</button>
        </div>
      </div>
    </modal>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import HTTP from '@/http';
import router from '@/router';

export default {
  name: 'DevTodo',

  data: () => {
    return {
      // data for modal
      modalInfo: {},

      // array of todo list
      todoList: null,
      errorMsg: null,

      //filtering type
      todoType: 'ALL'
    };
  },

  computed: {
    ...mapState('authentication', ['user'])
  },

  created() {
    //fetch todolist data from database
    this.fetchDevTodo();
  },

  methods: {
    ...mapActions('authentication', ['fetchTaskList', 'setExceptionError']),
    ...mapActions('errorStore', ['setGlobalError']),

    // reload collapse box event
    reloadCollapseEvent() {
      setTimeout(() => {
        $('.collapsed-box').boxWidget({
          animationSpeed: 500,
          collapseTrigger: "[data-widget='collapse']",
          collapseIcon: 'fa-minus',
          expandIcon: 'fa-plus'
        });
      }, 10);
    },

    // fetch dev todo list
    fetchDevTodo() {
      return HTTP()
        .get('/dev', {
          // request params to pass data from get requests
          params: {
            type: this.todoType
          }
        })
        .then(({ data }) => {
          this.todoList = data;
          this.reloadCollapseEvent();
        })
        .catch(e => {
          this.setGlobalError(e);
          router.push('/');
        });
    },

    setTodoType(type) {
      this.todoType = type;
    },
    //filter display todo
    todoFilter(todo) {
      switch (this.todoType) {
        case 'ALL':
          return false;
        case 'FLAG':
          return !todo.isFlagged || todo.isFlagged !== 1;
        case 'COMPLETE':
          return todo.percentage < 100;
      }
    },

    // set flag
    flagTodo(todo) {
      //reverse boolean
      todo.isFlagged = !(todo.isFlagged || todo.isFlagged === 1);
      HTTP()
        .patch(`/dev/todo/${todo.id}`, todo)
        .then(() => {
          //update header task menu
          this.fetchTaskList();
        })
        .catch(e => {
          this.setGlobalError(e);
        });
    },

    // set task status
    setTaskCompleted({ task, todo }) {
      //reverse isCompleted
      task.isCompleted = !(task.isCompleted || task.isCompleted === 1);

      //calculate parent completion percentage
      let dPercent = (1 / todo.task_num) * 100;

      // determine increasing or decreasing on percentage
      dPercent = task.isCompleted ? dPercent : -dPercent;
      todo.percentage += dPercent;
      todo.percentage = Math.round(todo.percentage);
      if (todo.percentage > 100) {
        todo.percentage = 100;
      } else if (todo.percentage < 0) {
        todo.percentage = 0;
      }

      HTTP()
        .patch(`/dev/task/complete/${task.id}`, task)
        .then(() => {
          //update header task menu
          this.fetchTaskList();
        })
        .catch(e => {
          this.setGlobalError(e);
        });
    },

    //todo information tool tip
    getTodoInfo(todo) {
      const info = `<table class='todo-detail'><tr><td>ID:</td><td>
        ${todo.id}
        </td></tr>
        <tr><td>Tk:</td><td>
        ${todo.task_num}
        </td></tr>
        <tr><td>&#9745;:</td><td>
        ${Math.round((todo.percentage / 100) * todo.task_num)}
        </td></tr> 
        </table>`;
      return info;
    },

    //return css class based on the task completion
    getCompletedClass(isCompleted) {
      return isCompleted || isCompleted === 1
        ? 'fa-check-square text-green'
        : 'fa-square-o';
    },

    //setup modal data then display confirm modal
    showConfirmModal(description, item, parent) {
      this.modalInfo = {
        description: description,
        item: item
      };
      if (!parent) {
        this.modalInfo.btnEvent = this.deleteTodo;
      } else {
        this.modalInfo.parent = parent;
        this.modalInfo.btnEvent = this.deleteTask;
      }
      this.$modal.show('ConfirmModal');
    },

    //setup modal data then display prompt modal
    showPromptModal(isEdit, description, item, parent) {
      this.modalInfo = {
        description: description,
        item: item,
        content: null,
        parent: parent
      };
      this.errorMsg = null;
      if (isEdit) {
        this.modalInfo.content = item.content;
        this.modalInfo.link = parent
          ? `/dev/task/${item.id}`
          : `/dev/todo/${item.id}`;
        this.modalInfo.btnEvent = this.editItem;
      } else {
        this.modalInfo.btnEvent = item ? this.addTask : this.addTodo;
      }
      this.$modal.show('PromptModal');
    },

    //remove selected todo
    deleteTodo() {
      var { item } = this.modalInfo;
      //remove todo from todoList array
      this.todoList = this.todoList.filter(value => value != item);
      HTTP()
        .delete(`/dev/todo/${item.id}`)
        .then(() => {
          //update header task menu if the selector is flagged
          if (item.isFlagged) this.fetchTaskList();
        })
        .catch(e => {
          this.setGlobalError(e);
        });
      this.$modal.hide('ConfirmModal');
    },

    //remove selected task
    deleteTask() {
      var { parent, item } = this.modalInfo;
      //remove task from its parent tasks array
      parent.tasks = parent.tasks.filter(value => value !== item);

      //calculate new completion percentage after task is deleted
      var dPercent = item.isCompleted ? (1 / parent.task_num) * 100 : 0;
      parent.percentage -= dPercent;
      parent.task_num--;
      parent.percentage = Math.round(
        ((parent.task_num + 1) * parent.percentage) / parent.task_num
      );

      HTTP()
        .delete(`/dev/task/${item.id}`)
        .then(() => {
          //this.fetchDevTodo;
        })
        .catch(e => {
          this.setGlobalError(e);
        });
      this.$modal.hide('ConfirmModal');
    },

    //add new todo
    addTodo() {
      if (this.modalHasInput()) {
        HTTP()
          .post('/dev/todo', this.modalInfo)
          .then(({ data }) => {
            this.fetchDevTodo();
          });

        this.$modal.hide('PromptModal');
      }
    },

    //add new task to selected todo
    addTask() {
      var { item } = this.modalInfo;
      if (this.modalHasInput()) {
        HTTP()
          .post(`/dev/todo/${item.id}/task`, this.modalInfo)
          .then(() => {
            this.fetchDevTodo();
          })
          .catch(e => {
            this.setGlobalError(e);
          });
        this.$modal.hide('PromptModal');
      }
    },

    //edit selected todo or task
    editItem() {
      if (this.modalHasInput()) {
        var { item, link } = this.modalInfo;
        item.content = this.modalInfo.content;
        HTTP()
          .patch(link, this.modalInfo)
          .then(() => {
            this.fetchTaskList();
          })
          .catch(e => {
            this.setGlobalError(e);
          });
        this.$modal.hide('PromptModal');
      }
    },

    //verify modal input is not empty
    modalHasInput() {
      if (this.modalInfo.content === null) {
        this.errorMsg = 'Input cannot be empty!';
        this.setGlobalError('wow');
        return false;
      }
      return true;
    }
  }
};
</script>


<style>
.todo-header {
  transition: 0.5s ease;
}
.todo-flagged {
  background: lightsteelblue !important;
}
.todo-detail td:first-child {
  padding-right: 5px;
}
.todo-detail td:last-child {
  text-align: right;
}
.devtask-style {
  padding-left: 20px;
  margin-bottom: 15px;
  min-height: 30px;
  box-shadow: -2px 2px 2px 2px rgba(176, 164, 176, 0.65);
}
.devtask-completed {
  box-shadow: -2px 2px 2px 2px rgba(15, 190, 44, 0.637);
}
.addTodoBtn {
  padding: 0;
  margin: 0;
  height: auto;
}
.modalbtn {
  width: 25%;
}
</style>
