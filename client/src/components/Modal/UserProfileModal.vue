<template>
  <modal
    name="user-modal"
    :adaptive="true"
    :classes="['v--modal', 'box', 'box-primary' , 'vue-dialog']"
    width="80%"
    height="auto"
    :max-width="500"
    :pivot-y="0.3"
    transition="slide-down"
    @before-open="getUser"
    @before-close="clearUser()"
  >
    <div class="box box-primary" style="margin:0; min-height:400px;">
      <div class="box-header with-border">
        <h3 class="box-title">
          <i class="fa fa-user"></i>
          &nbsp; User Profile
        </h3>

        <div class="box-tools pull-right">
          <a @click="$modal.hide('user-modal')" class="btn btn-box-tool">
            <i class="fa fa-close"></i>
          </a>
        </div>
      </div>
      <div>
        <div v-if="loading" class="overlay">
          <i class="fa fa-spinner fa-spin"></i>
        </div>
        <!-- /.box-header -->
        <transition name="fade">
          <div v-if="user" class="box-body box-profile">
            <Avator class="profile-user-img user-img" :fn="user.first_name" :ln="user.last_name"/>
            <h3 class="profile-username text-center">{{user.full_name}}</h3>

            <p class="text-muted text-center">{{user.role}}</p>

            <ul class="list-group list-group-unbordered">
              <li class="list-group-item">
                <b>Email</b>
                <p class="pull-right">{{user.email}}</p>
              </li>
              <li class="list-group-item">
                <b>Member Since</b>
                <p class="pull-right">{{formatDate(user.created_at)}}</p>
              </li>
              <li class="list-group-item">
                <b>Last Visit</b>
                <p class="pull-right">{{formatDate(user.updated_at)}}</p>
              </li>
              <li v-if="user.role==='Client'" class="list-group-item">
                <b>Total Change Requests</b>
                <p class="pull-right">{{user.totalRequest}}</p>
              </li>
            </ul>

            <a @click="composeMessage()" class="btn btn-primary btn-block">
              <b>Send Message</b>
            </a>
            <a
              v-if="user.role==='Client' && isAdmin"
              @click="enterCR()"
              class="btn btn-default btn-block"
            >
              <b>Enter Change Request</b>
            </a>
            <a
              v-if="user.role==='Client' && isAdmin"
              @click="searchCR()"
              class="btn btn-default btn-block"
            >
              <b>Search Change Requests</b>
            </a>
          </div>
        </transition>
      </div>
      <!-- /.box-footer -->
    </div>
  </modal>
</template>

<script>
import helper from '@/mixin/helper.js';
import HTTP from '@/http';
import Avator from '@/components/_Main/Avator';
import { mapMutations, mapGetters } from 'vuex';

export default {
  mixins: [helper],
  data() {
    return {
      user: null,
      loading: false
    };
  },

  computed: {
    ...mapGetters('userStore', ['isAdmin'])
  },
  components: {
    Avator
  },
  methods: {
    ...mapMutations('crStore', ['setClient']),
    getUser(event) {
      document.body.style.overflow = 'auto';
      this.loading = true;
      if (event) {
        //get user by params email
        HTTP()
          .get(`user/${event.params}`)
          .then(({ data }) => {
            if (data) {
              this.loading = false;
              this.user = data;
            }
          })
          .catch(e => {
            this.$store.dispatch('errorStore/setGlobalError', e);
          });
      }
    },

    clearUser() {
      document.body.style.overflow = 'auto';
      this.user = null;
    },

    // compose a message and use this user as receiver
    composeMessage() {
      if (this.user) {
        this.$modal.show('compose-msg', {
          receiver: [`${this.user.full_name} (${this.user.email})`]
        });
      }
    },

    // enter a change request for the user
    enterCR() {
      //set client
      this.setClient(`${this.user.full_name} (${this.user.email})`);
      //redirect to change request entry
      this.$router.push('/change-request/entry');
      //hide modal
      this.$modal.hide('user-modal');
    },

    // use search component to search change requests belongs to this user
    searchCR() {
      //redirect to data search
      this.$router.push(
        '/admin/change-request/search?user=' + this.user.full_name
      );
      //hide modal
      this.$modal.hide('user-modal');
    }
  }
};
</script>

<style>
</style>
