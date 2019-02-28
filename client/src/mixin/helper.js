/**
 * @author Wei Zheng
 * @description resuable static methods
 */

export default {
  methods: {
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
      const diff = new Date() - new Date(target);
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
    }
  }
};
