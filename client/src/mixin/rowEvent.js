/**
 * @author Wei Zheng
 * @description Row selecting/clicking event for datatable
 */

/* eslint-disable func-names */
export default {
  data() {
    return {
      loading: false,
      table: null
    };
  },

  methods: {
    // show dialog, alert when user did not select a row
    openSelectedRow(callBack, data) {
      if (data) {
        // display target dialog
        callBack(data);
      } else {
        // display no selection error massage
        this.$modal.show('dialog', {
          title:
            "<span class='text-yellow'><i class='fa fa-exclamation-triangle'></i> Alert! </span>",
          template:
            "<h4 style='text-align:center;'>You need to select a user</h4>",
          maxWidth: 300,
          buttons: [
            {
              title: 'Ok',
              default: true
            }
          ]
        });
      }
    },

    addRowSelectEvent(id, afterClick) {
      // focus and select table row
      const addTableSelect = (tr) => {
        if (!$(tr).hasClass('child')) {
          if (!$(tr).hasClass('selected')) {
            $(`${id} tbody .selected`).removeClass('selected');
            $(tr).addClass('selected');
          }
        }
      };

      // click select event
      $(`${id} tbody`).on('click', 'tr', function () {
        addTableSelect(this);
      });

      // double click event
      $(`${id} tbody`).on('dblclick', 'tr', function () {
        if (!$(this).hasClass('child')) {
          afterClick(this);
        }
      });

      let touched = false;
      // double tab event.
      $(`${id} tbody`).on('touchstart', 'tr', function () {
        if (!$(this).hasClass('child')) {
          addTableSelect(this);
          if (!touched) {
            touched = true;
            setTimeout(() => {
              touched = false;
            }, 200);
          } else {
            afterClick(this);
          }
        }
      });
    }
  }
};
