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
          <Avator class="img-circle" :fn="user.first_name" :ln="user.last_name"/>
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
        <li v-for="item in navItem" :class="{'header':item.split}" v-if="!item.hide">
          <span v-if="item.split">{{item.split}}</span>
          <router-link v-else :to="item.link">
            <i :class="item.icon"></i>
            <span>{{item.name}}</span>
          </router-link>
        </li>

        <li class="treeview">
          <a>
            <i class="fa fa-question-circle"></i>
            <span>Information</span>
            <span class="pull-right-container">
              <i class="fa fa-angle-left pull-right"></i>
            </span>
          </a>
          <ul class="treeview-menu">
            <li>
              <router-link to="/contact">
                <i class="fa fa-commenting"></i>Contact
              </router-link>
            </li>
            <li>
              <router-link to="/about">
                <i class="fa fa-info-circle"></i>About
              </router-link>
            </li>
          </ul>
        </li>

        <li class="treeview">
          <a>
            <i class="fa fa-book"></i>
            <span>Document</span>
            <span class="pull-right-container">
              <i class="fa fa-angle-left pull-right"></i>
            </span>
          </a>
          <ul class="treeview-menu">
            <li>
              <router-link to="/document/web-api">
                <i class="fa fa-link"></i>Web API
              </router-link>
            </li>
            <li>
              <router-link to="/document/page-routes">
                <i class="fa fa-arrow-circle-right"></i> Page Routes
              </router-link>
            </li>
            <li>
              <router-link to="/document/crviewer" download>
                <i class="fa fa-download"></i>Download CRViewer
              </router-link>
            </li>
          </ul>
        </li>
      </ul>
    </section>
  </aside>
</template>

<script>
import Avator from '@/components/_Main/Avator';
import HTTP from '@/http';
import helper from '@/mixin/helper';

export default {
  mixins: [helper],
  name: 'Sidebar',

  components: {
    Avator
  },

  data() {
    return {
      searchByUser: true,
      searchItem: [],
      selectfield: null
    };
  },
  computed: {
    navItem() {
      return [
        {
          split: 'DEVELOPER',
          hide: !this.isDev
        },
        {
          link: '/dev/todo',
          icon: 'ion ion-clipboard',
          name: 'Todo List',
          hide: !this.isDev
        },
        {
          link: '/dev/tool',
          icon: 'fa fa-wrench',
          name: 'Dev Tool',
          hide: !this.isDev
        },
        {
          split: 'ADMIN',
          hide: !this.isAdmin
        },
        {
          link: '/admin/change-request/',
          icon: 'fa fa-exchange',
          name: 'Manage Request',
          hide: !this.isAdmin
        },
        {
          link: '/admin/change-request/search',
          icon: 'fa fa-search',
          name: 'Find Request',
          hide: !this.isAdmin
        },
        {
          link: '/admin/chart',
          icon: 'fa fa-bar-chart',
          name: 'Data Chart',
          hide: !this.isAdmin
        },
        {
          link: '/admin/user-list',
          icon: 'fa fa-users',
          name: 'Manage User',
          hide: !this.isAdmin
        },
        {
          link: '/admin/generate-code',
          icon: 'fa fa-user-plus',
          name: 'Register Code',
          hide: !this.isAdmin
        },
        {
          split: 'APPLICATION'
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
          name: 'Track Request Status',
          hide: this.isAdmin
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
    isAdmin: Boolean,
    isDev: Boolean
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
      minimumInputLength: 1,
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
          state.id = state.email;
          parent.setAttribute('title', `${state.role} - ${state.email}`);
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
        delay: 250,
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
      if (this.searchItem && this.searchItem.length > 0) {
        if (this.searchByUser) {
          this.$modal.show('user-modal', this.searchItem);
        } else {
          //open change request
          this.$router.push(`/change-request/${this.searchItem}/content`);
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
