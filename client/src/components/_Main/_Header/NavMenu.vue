<template>
  <li class="dropdown" :class="getMenuClass(type)">
    <a class="dropdown-toggle" data-toggle="dropdown">
      <i :class="getIcon(type)"></i>
      <span class="label" :class="getLabelClass(type)">{{num}}</span>
    </a>
    <ul class="dropdown-menu">
      <li
        class="header"
        style="box-shadow: inset 0px 10px 30px lightgray; color:gray; font-size:80%; font-weight:bold;"
      >
        <span v-if="!text">You have {{num}} {{type}}</span>
        <span v-else>{{text}}</span>
      </li>
      <li>
        <!-- inner menu: contains the actual data -->
        <ul class="menu">
          <!-- element from parent -->
          <slot></slot>
          <!-- end message -->
        </ul>
      </li>
      <li v-if="footer" class="footer">
        <router-link :to="footer">View all</router-link>
      </li>
    </ul>
  </li>
</template>

<script>
export default {
  //number of information and type of information
  props: {
    num: Number,
    type: String,
    icon: String,
    footer: String,
    text: String
  },
  methods: {
    //convert menu type into type-menu css class
    getMenuClass: type => {
      return type + '-menu';
    },
    //convert menu type into type-label symbol
    getLabelClass: type => {
      switch (type) {
        case 'messages':
          return 'label-primary';
        case 'notifications':
          return 'label-warning';
        case 'tasks':
          return 'label-success';
      }
    },
    getIcon: type => {
      switch (type) {
        case 'messages':
          return 'fa fa-envelope-o';
        case 'notifications':
          return 'fa fa-bell-o';
        case 'tasks':
          return 'fa fa-flag-o';
      }
    }
  }
};
</script>

<style>
</style>
