import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
// import axios from 'axios'
import axios from "./libs/axios";
import VueCookies from "vue-cookies";
import qs from 'qs'
import 'element-ui/lib/theme-chalk/index.css';
import './router/guard.js'

Vue.use(ElementUI);
Vue.use(VueCookies);
Vue.config.productionTip = false;
Vue.prototype.$axios = axios;
axios.defaults.withCredentials = false;
// 实例对象
let instance = axios.create({
  timeout: 15000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

// 请求拦截器 
instance.interceptors.request.use(
  config => {
    config.data = qs.stringify(config.data) // 转为formdata数据格式
    return config
  },
  error => Promise.error(error)
)


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

