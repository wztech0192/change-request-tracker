<template>
  <div class="content-wrapper">
    <section class="content-header">
      <!-- Custom Tabs (Pulled to the right) -->
      <div class="nav-tabs-custom">
        <ul class="nav nav-tabs pull-right">
          <li :class="{'active':todoType==='COMPLETE'}">
            <a
              @click="setTodoType('COMPLETE')"
              href="#tab_1-1"
              data-toggle="tab"
              aria-expanded="false"
            >Completed</a>
          </li>
          <li :class="{'active':todoType==='FLAG'}">
            <a
              @click="setTodoType('FLAG')"
              href="#tab_2-2"
              data-toggle="tab"
              aria-expanded="false"
            >Flagged</a>
          </li>
          <li :class="{'active':todoType==='ALL'}">
            <a
              @click="setTodoType('ALL')"
              href="#tab_3-2"
              data-toggle="tab"
              aria-expanded="true"
            >All</a>
          </li>
          <!-- Add New ToDo Button  -->
          <a
            class="pull-right btn btn-app addTodoBtn"
            @click="showConfirmModal(true,'Create New Todo')"
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
            <!-- Loop and display all todo -->
            <div
              v-for="(todo, i) in getTodoList"
              :class="{'hide':todoFilter(todo)}"
              class="box box-widget box-solid box-default collapsed-box"
              data-widget="box-widget"
            >
              <div
                class="box-header with-border"
                style="padding-left:30px;"
                :class="{'todo-flagged':todo.isFlagged}"
              >
                <div
                  class="box-tools pull-left"
                  style="margin-left:-25px; position:relative;top:0; right:0;"
                >
                  <button
                    class="btn btn-box-tool"
                    data-toggle="tooltip"
                    title="Collapse"
                    data-widget="collapse"
                  >
                    <i class="fa fa-plus"></i>
                  </button>
                </div>

                <!-- Todo Edit -->
                <button
                  type="button"
                  class="pull-right btn btn-box-tool"
                  data-toggle="tooltip"
                  title="Edit"
                  @click="showConfirmModal(true, 'Edit Todo #'+(i+1),todo)"
                >
                  <i class="fa fa-edit"></i>
                </button>

                <!-- Todo Delete -->
                <button
                  type="button"
                  class="pull-right btn btn-box-tool"
                  data-toggle="tooltip"
                  title="Delete"
                  @click="showConfirmModal(false, 'Are You Sure You Want To Permanently Remove This Todo?',todo)"
                >
                  <i class="fa fa-trash"></i>
                </button>

                <!-- Task Add -->
                <button
                  type="button"
                  class="pull-right btn btn-box-tool"
                  data-toggle="tooltip"
                  title="Add Task"
                  @click="showConfirmModal(true, 'Create New Task For Todo #'+(i+1), todo)"
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

                <h5 class="box-title" style="font-size:100%; padding: 5px 0;">{{todo.title}}</h5>

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
                <!-- Loop and display each task inside each todo -->
                <div
                  v-for="task in todo.tasks"
                  class="devtask-style"
                  :class="{'devtask-completed':task.isCompleted}"
                >
                  <!-- Task Completion -->
                  <button
                    type="button"
                    class="btn btn-box-tool"
                    data-toggle="tooltip"
                    title="Complete"
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
                    @click="showConfirmModal(true, 'Edit Task #'+(i+1), task)"
                  >
                    <i class="fa fa-edit"></i>
                  </button>

                  <!-- Task Delete -->
                  <button
                    type="button"
                    class="pull-right btn btn-box-tool"
                    data-toggle="tooltip"
                    title="Delete"
                    @click="showConfirmModal(false, 'Are You Sure You Want To Permanently Remove This Task?',task)"
                  >
                    <i class="fa fa-trash"></i>
                  </button>
                  
                  <h5 style="display:inline;">{{task.detail}}</h5>

                </div>
              </div>
            </div>
          </div>
          <!-- /.tab-pane -->
        </div>
        <!-- /.tab-content -->
      </div>
    </section>

    <!-- Input Modal -->
    <modal
      name="InputModal"
      :adaptive="true"
      :scrollable="true"
      height="auto"
      width="80%"
      :max-width="400"
    >
      <div class="box box-primary" style="margin:0;">
        <div class="box-header with-border">
          <h3 class="box-title">{{modalHeader}}</h3>
        </div>
        <!-- /.box-header -->
        <!-- form start -->
        <div class="box-body">
          <!-- form start -->
          <div class="form-group" :class="{'has-error':errorMsg}">
            <label v-if="errorMsg" class="control-label" for="inputError">
              <i class="fa fa-times-circle-o"></i>
              {{errorMsg}}
            </label>
            <textarea v-model="modalInput" type="text" class="form-control" placeholder="Enter ..."></textarea>
          </div>
        </div>
        <!-- /.box-body -->
        <div class="box-footer">
          <button class="pull-right btn btn-primary" @click="modalInputConfirm()">Confirm</button>
          <button
            @click="$modal.hide('InputModal')"
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
            {{modalHeader}}
          </div>
        </div>
        <!-- /.box-header -->
        <!-- form start -->
        <!-- /.box-body -->
        <div class="box-footer">
          <button class="pull-right btn btn-primary" @click="modalAlertConfirm()">Remove</button>
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
import { mapGetters, mapMutations, mapActions, mapState } from "vuex";

export default {
  name: "DevTodo",
  data: () => {
    return {
      // data for modal
      modalHeader: null,
      modalInput: null,
      selectedID: null
    };
  },
  created() {
    //fetch todolist data from database to local state
    this.fetchDevTodo();
  },
  computed: {
    ...mapGetters("devTodo", ["getTodoList"]),
    ...mapState("devTodo", ["errorMsg", "todoType"])
  },
  methods: {
    ...mapMutations("devTodo", ["setErrorMsg", "setTodoType"]),
    ...mapActions("devTodo", [
      "fetchDevTodo",
      "addNewTodo",
      "addNewTask",
      "deleteTodo",
      "deleteTask",
      "editTodo",
      "editTask",
      "setTaskStatus",
      "setTodoFlag"
    ]),

    //allow update flaggedlist when perform a flag
    ...mapActions("authentication", ["fetchFlaggedList"]),

    //filter display todo
    todoFilter(todo) {
      switch (this.todoType) {
        case "ALL":
          return false;
        case "FLAG":
          return (!todo.isFlagged || todo.isFlagged !==1);
        case "COMPLETE":
          return todo.percentage < 100;
      }
    },

    //flag a todo
    flagTodo(todo) {
      //update todo state
      this.setTodoFlag(todo);
      //update user flagged list state, fire 50ms later so setFlag request will complete
      setTimeout(this.fetchFlaggedList, 50);
    },

    //todo information
    getTodoInfo(todo) {
      const info =
        `<table class='todo-detail'><tr><td>ID:</td><td>
        ${todo.id}
        </td></tr>
        <tr><td>Tk:</td><td>
        ${todo.task_num}
        </td></tr>
        <tr><td>&#9745;:</td><td>
        ${todo.percentage / 100 * todo.task_num }
        </td></tr> 
        </table>`;
      return info;
    },

    //determine if task is completed or not
    getCompletedClass(isCompleted) {
      return isCompleted || isCompleted === 1
        ? "fa-check-square text-green"
        : "fa-square-o";
    },

    //set task completion and update flagged list
    setTaskCompleted(data) {
      this.setTaskStatus(data);
      //update user flagged list state, fire 50ms later so setFlag request will complete
      setTimeout(this.fetchFlaggedList, 50);
    },

    //setup confirm modal then display it
    showConfirmModal(isInput, type, item) {
      if (item) this.selectedID = item.id;
      else this.selectedID = null;
      this.modalHeader = type;
      if (isInput) {
        this.setErrorMsg(null);
        //if task is edit, check condition and exist set input
        if (this.modalHeader.indexOf("Create") === -1) {
          this.modalInput = item.title ? item.title : item.detail;
        } else this.modalInput = null;
        this.$modal.show("InputModal");
      } else {
        this.$modal.show("ConfirmModal");
      }
    },

    //show alert modal
    modalAlertConfirm() {
      if (this.modalHeader.indexOf("Todo") >= 0) {
        this.deleteTodo(this.selectedID);
        //update user flagged list state, fire 50ms later so setFlag request will complete
        setTimeout(this.fetchFlaggedList, 50);
      } else {
        this.deleteTask(this.selectedID);
      }
      //close modal
      this.$modal.hide("ConfirmModal");
    },

    //send confirm input data to handler method
    modalInputConfirm() {
      if (this.modalInput) {
        this.setErrorMsg(null);
        //perform post html request if modal header has create
        if (this.modalHeader.indexOf("Create") >= 0) {
          // type is task detail if selectedID is not empty
          if (this.selectedID) {
            this.addNewTask({
              detail: this.modalInput,
              id: this.selectedID
            });
          }
          //else it is a todo title
          else {
            this.addNewTodo(this.modalInput);
            location.reload();
          }
        } else {
          if (this.modalHeader.indexOf("Todo") >= 0) {
            this.editTodo({
              title: this.modalInput,
              id: this.selectedID
            });
          } else {
            this.editTask({
              detail: this.modalInput,
              id: this.selectedID
            });
          }
        }

        //close modal if there is no error message
        if (!this.errorMsg) {
          //close modal
          this.$modal.hide("InputModal");
        }
      } else {
        this.setErrorMsg("Input is Empty!");
      }
    }
  }
};
</script>

<style>
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
  padding-left:20px;
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
