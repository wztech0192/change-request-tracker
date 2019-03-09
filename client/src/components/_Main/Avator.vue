<template>
  <div class="avator" :class="getBG()">
    <span>{{ltr}}</span>
  </div>
</template>

<script>
export default {
  props: {
    fn: String,
    ln: String,
    fullName: String
  },

  computed: {
    ltr() {
      if (this.fullName) {
        var split = this.fullName.split(' ');

        return split[0].charAt(0) + split[2].charAt(0);
      } else if (this.fn && this.ln) {
        return this.fn.charAt(0) + this.ln.charAt(0);
      } else {
        return 'ZZ';
      }
    }
  },

  methods: {
    getBG() {
      //set color based on first letter of first name
      switch (this.ltr.charAt(0).toUpperCase()) {
        case 'A':
        case 'B':
          return 'bg-blue';
        case 'C':
        case 'D':
          return 'bg-navy';
        case 'E':
        case 'F':
          return 'bg-gray';
        case 'G':
        case 'H':
          return 'bg-teal';
        case 'I':
        case 'J':
          return 'bg-purple';
        case 'K':
        case 'L':
          return 'bg-red';
        case 'M':
        case 'N':
          return 'bg-maroon';
        case 'O':
        case 'P':
          return 'bg-orange';
        case 'Q':
        case 'R':
          return 'bg-yellow';
        case 'S':
        case 'T':
          return 'bg-green';
        case 'U':
        case 'V':
        case 'W':
          return 'bg-blue';
        case 'X':
        case 'Y':
        case 'Z':
          return 'bg-black';
      }
    }
  }
};
</script>

<style>
.avator {
  box-shadow: 0px 0px 2px lightgray;

  width: 25px;
  height: 25px;
  vertical-align: middle;
  text-align: center;
  font-size: 12px !important;
  line-height: 26px !important;
  border: 0;
  border-radius: 50%;
  transition: 0.2s ease;
}

.user-panel > .image > div {
  width: 45px;
  height: 45px;
  font-size: 20px !important;
  line-height: 45px !important;
}

.sidebar-collapse .user-panel > .image > div {
  width: 30px;
  height: 30px;
  font-size: 14px !important;
  line-height: 30px !important;
}

.img-sm {
  line-height: 30px !important;
}
.navbar-nav > .user-menu > .dropdown-menu > li.user-header > div {
  z-index: 5;
  height: 60px;
  width: 60px;
  border: 3px solid;
  margin: 0 auto;
  border-color: transparent;
  border-color: rgba(255, 255, 255, 0.2);
  font-size: 26px !important;
  line-height: 50px !important;
}
</style>
