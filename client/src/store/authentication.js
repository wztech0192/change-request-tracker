/**
 * Store authenication details
 */

import HTTP from '../http';
import router from '../router';

export default {
  namespaced: true,
  /**
   * state attribute
   */
  state: {
    registerData: {
      first_name: null,
      mid_initial: null,
      last_name: null,
      email: null,
      password: null,
      password_retype: null
    },
    user: {
      first_name: null,
      mid_initial: null,
      last_name: null,
      email: null
    },
    error: {
      first_name_error: null,
      last_name_error: null,
      email_error: null,
      password_error: null,
      ex_error: null
    },
    token: null,
    loading: false,
    flaggedList: []
  },

  /**
   * do action related to current state
   */
  actions: {
    // fetch user profile
    fetchUser({ commit }) {
      return HTTP().get('/user')
        // if user exist set user information in state, else set error message then redirect to login view
        .then(({ data }) => {
          if (data) {
            commit('setUser', data);
          } else {
            commit('setExceptionError', "Cannot find the user. Try to Re-login.");
            router.push('/login');
          }
        })
        .catch(() => {
          commit('setExceptionError', "Cannot find the user. Try to Re-login.");
          router.push('/login');
        });
    },

    // get user flagged list
    fetchFlaggedList({ commit }) {
      return HTTP().get('/user/flagged')
        .then(({ data }) => {
          if (data) {
            commit('setFlaggedList', data);
          } else {
            commit('setFlaggedList', []);
          }
        })
        .catch(() => {
          commit('setExceptionError', "Cannot find the user. Try to Re-login.");
          router.push('/login');
        });
    },

    // submit register data to server
    registerSubmit({ commit, state }) {
      const rd = state.registerData;

      // stop if password and confirm password do not match
      if (rd.password !== rd.password_retype) {
        commit('clearRegisterPassword');
        return "fail";
      }
      /**
       * post data to server
       * then retrieve message from server
       * else catch the error
       */
      commit('setLoading', true);
      return HTTP().post('/auth/register', rd)
        .then(({ data }) => {
          // Set token and clear register data if token is avaliable, else return validation error
          if (data.token) {
            commit('setToken', data.token);
            commit('clearRegisterData');
            // redirect route plus reload page
            // window.location.href = "/";
            router.push('/');
          } else {
            commit('setMessageError', data);
          }
        })
        .catch(() => {
          commit('setExceptionError', "Unknown Register Error");
        })
        .finally(() => {
          commit('setLoading', false);
        });
    },

    // login http request
    loginSubmit({ commit, state }) {
      console.log(state);
      // clear exception error
      commit('clearExceptionError');
      commit('setLoading', true);
      return HTTP().post('/auth/login', state.user)
        .then(({ data }) => {
          console.log(data);
          // redirect router if data has token, else show error message
          if (data.token) {
            commit('clearLoginData');
            commit('clearRegisterData');
            commit('setToken', data.token);
            // redirect route plus reload page
            // window.location.href = "/";
            router.push('/');
          } else {
            commit('setExceptionError', "Wrong Password or Email!");
          }
        })
        .catch(() => {
          commit('setExceptionError', "Wrong Password or Email!");
        })
        .finally(() => {
          commit('setLoading', false);
        });
    },

    // set token to null
    logoutToken({ commit }) {
      commit('setToken', null);
    }

  },

  /**
   * get state information
   */
  getters: {
    // check if user is logged in
    isLoggedIn(state) {
      //! return true when empty, another ! make it return false when empty
      return !!state.token;
    }
  },

  /**
   * Make changes to the state
   */
  mutations: {

    // set user flagged list
    setFlaggedList(state, flagList) {
      state.flaggedList = flagList;
    },

    // login user information include token
    setUser(state, user) {
      state.user = user;
    },

    // set token after successfully login
    setToken(state, token) {
      state.token = token;
    },

    // toggle loading status
    setLoading(state, status) {
      state.loading = status;
    },

    // set login user data
    setLoginData(state, el) {
      switch (el.target.name) {
        case 'email':
          state.user.email = el.target.value;
          break;
        case 'password':
          state.user.password = el.target.value;
          break;
        default:
      }
    },

    // set exception errors
    setExceptionError(state, string) {
      state.user.password = null;
      state.error.ex_error = string;
    },

    clearExceptionError(state) {
      state.error = {
        first_name_error: null,
        last_name_error: null,
        email_error: null,
        password_error: null,
        ex_error: null
      };
    },

    // empty login user data
    clearLoginData(state) {
      state.user = {
        email: null,
        password: null
      };
      state.error.ex_error = null;
    },

    // clear register password
    clearRegisterPassword(state) {
      state.registerData.password = null;
      state.registerData.password_retype = null;
      state.error.password_error = "Your password and confirmation password do not match.";
    },

    // empty register data
    clearRegisterData(state) {
      state.registerData = {
        first_name: null,
        mid_initial: null,
        last_name: null,
        email: null,
        password: null,
        password_retype: null
      };
      state.error = {
        first_name_error: null,
        last_name_error: null,
        email_error: null,
        password_error: null,
        ex_error: null
      };
    },

    // loop through all exception error then set message to the associated field
    setMessageError(state, exceptionArr) {
      exceptionArr.forEach((ex) => {
        switch (ex.field) {
          case 'email':
            state.error.email_error = ex.message;
            break;
          case 'first_name':
            state.error.first_name_error = ex.message;
            break;
          case 'last_name':
            state.error.last_name_error = ex.message;
            break;
          case 'password':
            state.error.password_error = ex.message;
            break;
          default:
        }
      });
    },

    // bind input value to state register data based on input name
    setRegisterData(state, el) {
      switch (el.target.name) {
        case 'first_name':
          state.registerData.first_name = el.target.value;
          state.error.first_name_error = null;
          break;
        case 'mid_initial':
          state.registerData.mid_initial = el.target.value;
          break;
        case 'last_name':
          state.registerData.last_name = el.target.value;
          state.error.last_name_error = null;
          break;
        case 'email':
          state.registerData.email = el.target.value;
          state.error.email_error = null;
          break;
        case 'password':
          state.registerData.password = el.target.value;
          if (el.target.value !== state.registerData.password_retype) {
            state.error.password_error = "Your password and confirmation password do not match.";
          } else {
            state.error.password_error = null;
          }
          break;
        case 'password_retype':
          state.registerData.password_retype = el.target.value;
          if (el.target.value !== state.registerData.password) {
            state.error.password_error = "Your password and confirmation password do not match.";
          } else {
            state.error.password_error = null;
          }
          break;
        default:
      }
    }
  }
};
