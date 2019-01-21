import axios from 'axios';
import store from "./store";

// Do http request, time out after 5 sec
export default () => axios.create({
  baseURL: store.state.baseURL,
  timeout: 5000
});
