/**
 * Store authenication details
 */

import HTTP from '../http';
import router from '../router';

export default {
  namespaced: true,
  state: {
    registerData: {
      first_name: "",
      mid_initial: "",
      last_name: "",
      email: "",
      password: "",
      password_retype: "",
      first_name_error: "",
      last_name_error: "",
      email_error: "",
      password_error: ""
    },
    token: null
  },

  actions: {

    // submit register data to server
    registerSubmit({ commit, state }) {
      // stop if password and confirm password do not match
      if (state.registerData.password !== state.registerData.password_retype) {
        commit('clearRegisterPassword');
        return "fail";
      }
      /**
         * post data to server
         * then retrieve message from server
         * else catch the error
         */
      return HTTP().post('/auth/register', state.registerData)
        .then(({ data }) => {
          // Set token if data type is bearer, else return validation error
          if (data.type === 'bearer') {
            commit('setToken', data.token);
            router.push('/');
          } else {
            commit('setRegisterError', data);
            console.log(state);
          }
        });
    }
  },

  mutations: {

    // set token after successfully login
    setToken(state, token) {
      state.token = token;
    },

    // clear register password
    clearRegisterPassword(state) {
      state.registerData.password = "";
      state.registerData.password_retype = "";
      state.registerData.password_error = "Your password and confirmation password do not match.";
    },

    // empty register data
    clearRegisterData(state) {
      state.registerData = {
        first_name: "",
        mid_initial: "",
        last_name: "",
        email: "",
        password: "",
        password_retype: "",
        first_name_error: "",
        last_name_error: "",
        email_error: "",
        password_error: ""
      };
    },

    // loop through all exception error then set message to the associated field
    setRegisterError(state, exceptionArr) {
      exceptionArr.forEach((ex) => {
        switch (ex.field) {
          case 'email':
            state.registerData.email_error = ex.message;
            break;
          case 'first_name':
            state.registerData.first_name_error = ex.message;
            break;
          case 'last_name':
            state.registerData.last_name_error = ex.message;
            break;
          case 'password':
            state.registerData.password_error = ex.message;
            break;
          default:
        }
      });
    },

    // bind input value to state register data based on input name
    setRegisterData(state, e) {
      switch (e.target.name) {
        case 'first_name':
          state.registerData.first_name = e.target.value;
          state.registerData.first_name_error = "";
          break;
        case 'mid_initial':
          state.registerData.mid_initial = e.target.value;
          break;
        case 'last_name':
          state.registerData.last_name = e.target.value;
          state.registerData.last_name_error = "";
          break;
        case 'email':
          state.registerData.email = e.target.value;
          state.registerData.email_error = "";
          break;
        case 'password':
          state.registerData.password = e.target.value;
          if (e.target.value !== state.registerData.password_retype) {
            state.registerData.password_error = "Your password and confirmation password do not match.";
          } else {
            state.registerData.password_error = "";
          }
          break;
        case 'password_retype':
          state.registerData.password_retype = e.target.value;
          if (e.target.value !== state.registerData.password) {
            state.registerData.password_error = "Your password and confirmation password do not match.";
          } else {
            state.registerData.password_error = "";
          }

          break;
        default:
      }
    }
  }
};
