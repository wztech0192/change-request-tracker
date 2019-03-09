<!--
 - @author: Wei Zheng
 - @description: navigation bar
 -->

<template>
  <aside class="main-sidebar" style="font-size : 14px;">
    <!-- sidebar: style can be found in sidebar.less -->
    <section class="sidebar">
      <!-- Sidebar user panel -->
      <div class="user-panel">
        <div class="pull-left image">
          <img src="@/assets/img/default.jpg" class="img-circle" alt="User Image">
        </div>
        <div class="pull-left info capitalize">
          <p>{{user.full_name}}</p>

          <i class="fa fa-address-card capitalize"></i>
          &nbsp; {{user.role}}
        </div>
      </div>
      <form class="sidebar-form">
        <div class="input-group">
          <span class="input-group-btn">
            <button
              class="btn btn-flat"
              @click.prevent="changeSearchItem"
              style="width:32px !important; height:34px !important; padding:2px;"
            >
              <transition name="list" mode="out-in">
                <i v-if="searchByUser" class="fa fa-user" key="1"></i>
                <i v-else class="fa fa-exchange" key="2"></i>
              </transition>
            </button>
            
            <select
              id="nav-search"
              type="text"
              class="form-control"
              :placeholder="searchByUser?'Search User...':'Search Request....'"
            ></select>
            <button
              class="btn btn-flat"
              :class="{'disabled':searchItem.length<=0}"
              @click.prevent="openItem"
              style="width:32px !important; height:34px !important; padding:2px;"
            >
              <span class="fa fa-search"></span>
            </button>
          </span>
        </div>
      </form>
      <!-- sidebar menu: : style can be found in sidebar.less -->
      <ul class="sidebar-menu" data-widget="tree">
        <li v-for="item in navItem" :class="{'header':item.split}">
          <span v-if="item.split">{{item.split}}</span>
          <router-link v-else :to="item.link">
            <i :class="item.icon"></i>
            <span>{{item.name}}</span>
          </router-link>
        </li>

        <li class="treeview">
          <a href="#">
            <i class="fa fa-book"></i>
            <span>Document</span>
            <span class="pull-right-container">
              <i class="fa fa-angle-left pull-right"></i>
            </span>
          </a>
          <ul class="treeview-menu">
            <li>
              <a href="pages/tables/simple.html">
                <i class="fa fa-circle-o"></i>Simple tables
              </a>
            </li>
            <li>
              <a href="pages/tables/data.html">
                <i class="fa fa-circle-o"></i> Data tables
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </section>
  </aside>
</template>

<script>
import HTTP from '@/http';
import helper from '@/mixin/helper';

export default {
  mixins: [helper],
  name: 'Sidebar',
  data() {
    return {
      searchByUser: true,
      searchItem: [],
      selectfield: null
    };
  },
  computed: {
    navItem: () => {
      return [
        {
          split: 'Developer'
        },
        {
          link: '/dev/todo',
          icon: 'ion ion-clipboard',
          name: 'Todo List'
        },
        {
          link: '/dev/tool',
          icon: 'fa fa-wrench',
          name: 'Dev Tool'
        },
        {
          split: 'Admin'
        },
        {
          link: '/admin/change-request/',
          icon: 'fa fa-exchange',
          name: 'Manage Request'
        },
        {
          link: '/admin/change-request/search',
          icon: 'fa fa-search',
          name: 'Find Request'
        },
        {
          link: '/admin/chart',
          icon: 'fa fa-bar-chart',
          name: 'Data Chart'
        },
        {
          link: '/admin/user-list',
          icon: 'fa fa-users',
          name: 'Manage User'
        },
        {
          link: '/admin/generate-code',
          icon: 'fa fa-user-plus',
          name: 'Register Code'
        },
        {
          split: 'NAVIGATION'
        },
        {
          link: '/',
          icon: 'fa fa-dashboard',
          name: 'Dashboard'
        },
        {
          link: '/change-request/entry',
          icon: 'fa fa-edit',
          name: 'Enter Change Request'
        },
        {
          link: '/change-request',
          icon: 'fa fa-exchange',
          name: 'Track Request Status'
        },
        {
          link: '/mailbox',
          icon: 'fa fa-envelope',
          name: 'Mailbox'
        }
      ];
    }
  },
  //data from parent
  props: {
    user: { type: Object, required: false, default: 'Anonymous' },
    isAdmin: Boolean
  },

  mounted() {
    // highlight selected link
    $('.sidebar-menu li>a').click(() => {
      $('.selected').removeClass('selected');
      $(this).addClass('selected');
    });

    const self = this;
    //initialize select2 for user / change request search
    this.selectfield = $('#nav-search').select2({
      width: '150px',
      multiple: true,
      maximumSelectionLength: 1,

      placeholder: 'Search....',
      templateSelection: (state, parent) => {
        parent.css('width', '90%');
        parent
          .children()
          .eq(0)
          .remove();
        var text = self.searchByUser ? state.full_name : `CR ID: ${state.id}`;
        var item = $(
          `<span class='select2-selection__choice__remove text-black' style='width:100%;'>${text}</span> `
        );
        return item;
      },
      templateResult: (state, parent) => {
        if (self.searchByUser) {
          state.id = state.full_name;
          parent.setAttribute('title', state.email);
          return state.full_name;
        } else {
          parent.value = state.id;
          parent.setAttribute('title', state.title);
          return state.id
            ? $(
                `<span>CR ID:${
                  state.id
                } <br><label class='label ${self.getStatusCSS(
                  'label',
                  state.status
                )}'>${state.status}</label></span>`
              )
            : 'Searching...';
        }
      },
      ajax: {
        delay: 500,
        transport: function({ data }, success, failure) {
          var url = self.searchByUser
            ? `user/search/all`
            : `change-request/search/${self.isAdmin ? 'all' : self.user.id}`;

          HTTP()
            .post(url, {
              term: data.term || '',
              page: data.page || 1
            })
            .then(({ data }) => {
              success(data);
            })
            .catch(e => {
              self.$store.dispatch('errorStore/setGlobalError', e);
            });
        }
      }
    });

    this.selectfield.on('change', function() {
      self.searchItem = this.value;

      //display search place holder if not item is selected
      if (self.searchItem.length <= 0) {
        $('.sidebar .select2-search').show();
      } else {
        $('.sidebar .select2-search').hide();
      }
    });
  },

  methods: {
    //toggle search item. Search by User or Change Request
    changeSearchItem() {
      this.searchByUser = !this.searchByUser;
      // clear selected item
      this.selectfield.val('').trigger('change');
    },

    //open selected item.
    openItem() {
      if (this.searchItem) {
        if (this.searchByUser) {
        } else {
          //open change request
          this.$router.push('/change-request/' + this.searchItem);
        }
      }
    }
  }
};
</script>

<style>
.sidebar-menu > li > a {
  transition: 0.2s ease;
}
.sidebar-menu li .router-link-exact-active {
  background: #ecf0f5 !important;
  color: black !important;
}

.sidebar-menu > li:hover > a > i {
  color: #00a2ff !important;
}
.sidebar-menu > li > a > .fa,
.sidebar-menu > li > a > .glyphicon,
.sidebar-menu > li > a > .ion {
  width: 24px;
}

.sidebar-form {
  border-radius: none !important;
  border: none !important;
  margin: 10px !important;
}
.sidebar .select2-selection {
  border-radius: 0 !important;
}
.sidebar .select2-container--bootstrap {
  display: inline-block;
}
</style>
