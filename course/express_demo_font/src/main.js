import Vue from "vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import axios from "./utils/axios";
import App from "./App.vue";
import router from "./router/index";
import store from "./store";
import VueSocketIO from "vue-socket.io";
Vue.use(
  new VueSocketIO({
    debug: true,
    // 服务器端地址
    connection: "http://localhost:3000",
    vuex: {}
  })
);
Vue.prototype.$axios = axios;
Vue.use(ElementUI);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
