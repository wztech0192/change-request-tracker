/**
 * @author Wei Zheng
 * @description resuable static methods
 */

export default {
  methods: {
    // re-format date string
    formatDate(date) {
      // safari does not support YYYY-MM-DD format
      if (date) {
        date = new Date(date.replace(/-/g, '/'));
        const dateString = date.toDateString().split(' ');
        const formatedDateString = `${dateString[2]} ${dateString[1]}, ${
          dateString[3]
        }`;
        return `${formatedDateString} ${date.toLocaleTimeString()}`;
      }
      return null;
    },

    // get css class based on status
    getStatusCSS(css, status) {
      switch (status) {
        case 'To Do':
          return `${css}-warning`;
        case 'In Progress':
          return `${css}-primary`;
        case 'Complete':
          return `${css}-success`;
        default:
          return `${css}-danger`;
      }
    },

    // calculate total time elapsed from target date to now
    calculateTimeElapsed(target, ending) {
      // calculate duration
      const diff = new Date() - Date.parse(target.replace(/-/g, '/')); // safari does not support YYYY-MM-DD

      if (diff > 86400000) {
        // days
        return Math.round(diff / 86400000) + ending[2];
      }
      if (diff > 3600000) {
        // hours
        return Math.round(diff / 3600000) + ending[1];
      }
      // minutes
      return Math.round(diff / 60000) + ending[0];
    },

    // composed a new message with current content and subject
    forwardMSG(msg) {
      const forwardData = {
        receiver: [],
        title: msg.title,
        content: msg.content
      };
      this.$modal.show('compose-msg', forwardData);
    },

    // composed a reply message
    replyMSG(msg) {
      const replyData = {
        receiver: [`${msg.senderName} (${msg.senderEmail})`],
        title: `RE: ${msg.title}`,
        content: `<p></p><p></p><p></p><p></p><p></p><p></p>\n\n\n\n\n\n\n\n
            <p>------ PREVIOUS MESSAGE ------</p>\n
            <p>Date: ${msg.created_at}</p>\n
            <p> Sender: ${msg.senderName}</p>\n
            <p>Sender Email: ${msg.senderEmail}</p>\n
            <p>*****</p>
            ${msg.content}
        `
      };
      this.$modal.show('compose-msg', replyData);
    }
  }
};
