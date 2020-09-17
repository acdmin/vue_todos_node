// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import Qs from 'qs'

Vue.config.productionTip = false

axios.defaults = {
    headers: {
        "Content-Type": "application/x-www-form-urlencoded"
    },
    timeout: 10000,
    withCredentials: true,//让ajax携带cookie
};

// Vue.prototype = {
//   $http: axios,
//   $qs: Qs
// }
Vue.prototype.$http = axios;
Vue.prototype.$qs = Qs;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
