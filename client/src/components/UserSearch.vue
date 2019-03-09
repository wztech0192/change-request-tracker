<template>
  <select :id="id" class="js-states form-control">
    <slot></slot>
  </select>
</template>

<script>
import HTTP from '@/http';
export default {
  props: {
    onChange: Function,
    multiple: Boolean,
    searchRole: String,
    useEmailID: Boolean,
    placeholder: String,
    id: {
      type: String,
      default: 'select2'
    }
  },
  mounted() {
    const self = this;
    //initialize select2 for user search
    $('#' + self.id).select2({
      width: '100%',

      multiple: self.multiple,
      placeholder: self.placeholder,

      ajax: {
        delay: 500,

        transport: function({ data }, success, failure) {
          HTTP()
            .post(`user/search/${self.searchRole}`, {
              term: data.term || '',
              page: data.page || 1
            })
            .then(({ data }) => {
              success(data);
            })
            .catch(e => {
              self.$store.dispatch('errorStore/setGlobalError', e);
            });
        },
        processResults: function(data, params) {
          // use full name as text and id for the options
          data.results.forEach(d => {
            d.text = self.useEmailID
              ? `${d.full_name} (${d.email})`
              : d.full_name;

            d.id = d.text;
          });
          return data;
        }
      }
    });

    //retrieve select2 data
    $('#' + self.id).on('change', function() {
      self.onChange($(this).val());
    });
  },

  methods: {
    //clear select
    clear() {
      $('#' + this.id)
        .val(null)
        .trigger('change');
    }
  }
};
</script>

<style>
.select2-container--loading {
  font-size: 1000%;
}

span #select2-select2-container {
  padding-top: 5px;
}
</style>
