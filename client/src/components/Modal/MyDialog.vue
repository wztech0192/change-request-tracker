<template>
  <modal
    name="dialog"
    :adaptive="true"
    height="auto"
    :classes="['v--modal', 'box' , 'vue-dialog', this.params.class]"
    width="80%"
    :max-width="maxWidth"
    :pivot-y="0.3"
    transition="slide-down"
    @before-open="beforeOpened"
    @before-close="beforeClosed"
    @opened="$emit('opened', $event)"
    @closed="$emit('closed', $event)"
  >
    <div v-if="spinner.loading" class="overlay">
      <i class="fa fa-spinner fa-spin"></i>
    </div>
    <div class="dialog-content">
      <h4 v-if="params.title" v-html="params.title || ''"></h4>
      <hr style="margin:10px 0">
      <p class="dialog-error text-red" style="margin:0;"></p>
      <component v-if="params.component" v-bind="params.props" :is="params.component"></component>
      <div class="dialog-c-text" v-else v-html="params.template || ''"></div>
    </div>
    <div class="vue-dialog-buttons" v-if="buttons">
      <button
        v-for="(button, i) in buttons"
        :class="button.class || ('vue-dialog-button '+getButtonClass(button.title))"
        type="button"
        style="font-size:100% !important"
        :style="buttonStyle"
        :key="i"
        @click.stop="click(spinner, i, $event)"
      >
        {{button.title}}
        <i :class="getButtonIcon(button.title)"></i>
      </button>
    </div>
    <div v-else class="vue-dialog-buttons-none"></div>
  </modal>
</template>
<script>
export default {
  name: 'VueJsDialog',
  props: {
    width: {
      type: [Number, String],
      default: 400
    },
    clickToClose: {
      type: Boolean,
      default: true
    },
    transition: {
      type: String,
      default: 'fade'
    }
  },
  data() {
    return {
      params: {},
      defaultButtons: [{ title: 'CLOSE' }],
      spinner: {
        loading: false
      }
    };
  },
  computed: {
    maxWidth() {
      return this.params.maxWidth || 400;
    },

    buttons() {
      return this.params.buttons || this.defaultButtons;
    },
    /**
     * Returns FLEX style with correct width for arbitrary number of
     * buttons.
     */
    buttonStyle() {
      return {
        flex: `1 1 ${100 / this.buttons.length}%`
      };
    }
  },
  methods: {
    beforeOpened(event) {
      window.addEventListener('keyup', this.onKeyUp);
      this.params = event.params || {};
      this.$emit('before-opened', event);
    },
    beforeClosed(event) {
      window.removeEventListener('keyup', this.onKeyUp);
      this.params = {};
      this.$emit('before-closed', event);
    },
    click(spinner, i, event, source = 'click') {
      const button = this.buttons[i];

      if (button && typeof button.handler === 'function') {
        button.handler(spinner, i, event, { source });
      } else {
        this.$modal.hide('dialog');
      }
    },
    onKeyUp(event) {
      if (event.which === 13 && this.buttons.length > 0) {
        const buttonIndex =
          this.buttons.length === 1
            ? 0
            : this.buttons.findIndex(button => button.default);
        if (buttonIndex !== -1) {
          this.click(this.spinner, buttonIndex, event, 'keypress');
        }
      }
    },
    getButtonIcon(title) {
      switch (title) {
        case 'Confirm':
        case 'Ok':
        case 'Hide':
          return 'fa fa-check';
        case 'Cancel':
          return 'fa fa-times';
        case 'Direct Me':
          return 'fa fa-arrow-circle-o-right';
        case 'Show Profile':
          return 'fa fa-user';
      }
    },

    getButtonClass(title) {
      switch (title) {
        case 'Confirm':
        case 'Ok':
        case 'Hide':
          return 'vue-dialog-confirm';
        case 'Cancel':
          return 'vue-dialog-cancel';
        case 'Direct Me':
        case 'Show Profile':
          return 'vue-dialog-direct';
      }
    }
  }
};
</script>

<style>
.vue-dialog-button {
  transition: 0.3s ease;
  font-weight: bolder;
}

.vue-dialog-confirm:hover {
  background: rgb(143, 235, 143) !important;
  color: rgb(255, 255, 255) !important;
}

.vue-dialog-direct:hover {
  background: rgb(125, 195, 228) !important;
  color: rgb(255, 255, 255) !important;
}

.vue-dialog-cancel:hover {
  background: rgb(238, 118, 118) !important;
  color: rgb(255, 255, 255) !important;
}
</style>
