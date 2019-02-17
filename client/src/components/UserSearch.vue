<template>
  <select id="select2" class="js-states form-control">
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
    useEmailID: Boolean
  },
  mounted() {
    const self = this;
    //initialize select2 for user search
    $('#select2').select2({
      width: '100%',
      allowClear: true,
      multiple: self.multiple,

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
              failure(e);
            });
        },
        processResults: function(data, params) {
          // use full name as text and id for the options
          data.results.forEach(d => {
            if (self.useEmailID) {
              d.text = `${d.full_name} (${d.email})`;
              d.id = `${d.full_name} (${d.email}) ${d.id}`;
            } else {
              d.text = d.full_name;
              d.id = d.full_name;
            }
          });
          return data;
        }
      }
    });

    //retrieve select2 data
    $('#select2').on('change', function() {
      self.onChange($(this).val());
    });
  },

  methods: {
    //clear select
    clear() {
      $('#select2')
        .val(null)
        .trigger('change');
    }
  }
};
</script>

<style>
</style>
