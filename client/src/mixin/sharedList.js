import { mapState, mapActions, mapGetters } from 'vuex';
import helper from './helper';

export default {
  mixins: [helper],

  computed: {
    ...mapState('userStore', ['user', 'flagList', 'notifyList', 'msgList']),
    ...mapGetters('userStore', ['isAdmin'])
  },

  methods: {
    ...mapActions('userStore', ['clearNewNotification', 'clearNewMsg']),

    // if has date and time, split date out and return it
    getDate(DateAndTime) {
      if (DateAndTime) {
        return DateAndTime.split(' ')[0];
      }
      return 'N/A';
    },

    notifyDetail(notify) {
      if (notify.isNew) {
        // remove new status
        this.clearNewNotification(notify.id);
      }
      // display notify detail modal
      this.$modal.show('dialog', {
        title:
          "<span class='text-blue'><i class='fa fa-info'></i> Notification</span>",
        template: `
        <label>Create Date</label>
        <p>${notify.created_at}</p>
        <label>Content</label>
        <p>${notify.content}</p>
        `,
        maxWidth: 300,
        buttons: notify.link
          ? [
            {
              title: 'Direct Me',
              handler: () => {
                this.$router.push(notify.link);
                this.$modal.hide('dialog');
              }
            },
            {
              title: 'Hide',
              default: true
            }
          ]
          : [
            {
              title: 'Ok',
              default: true
            }
          ]
      });
    },

    // define progress bar color based on its percentage
    getProgressBarColor: (percent) => {
      if (percent < 100) {
        return 'progress-bar-primary';
      }
      return 'progress-bar-success';
    },

    // display maximum of 35 characters
    limitContentLength(content, length) {
      if (content.length > length) {
        // split from the last empty space
        let i = content.indexOf(' ', length - 8);
        if (i < 0) i = length;
        return `${content.substring(0, content.indexOf(' ', i))}...`;
      }
      return content;
    }
  }
};
