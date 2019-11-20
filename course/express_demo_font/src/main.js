import Vue from "vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "element-ui/lib/theme-chalk/display.css";
import axios from "./utils/axios";
import App from "./App.vue";
import router from "./router/index";
import store from "./store";
import VueSocketIO from "vue-socket.io";
import mavonEditor from "mavon-editor";
import "mavon-editor/dist/css/index.css";
//引入nprogress
import NProgress from "nprogress"; // 进度条
import "nprogress/nprogress.css"; //这个样式必须引入
// nprogress简单配置
NProgress.inc(0.2);
NProgress.configure({
  easing: "ease",
  speed: 500,
  showSpinner: false
});
router.beforeEach((to, from, next) => {
  NProgress.start();
  next();
});

router.afterEach(() => {
  NProgress.done();
});

Vue.use(
  new VueSocketIO({
    debug: true,
    // 服务器端地址
    connection: "http://localhost:3000",
    vuex: {}
  })
);
Vue.prototype.$axios = axios;
Vue.prototype.$NProgress = NProgress;
Vue.use(ElementUI);
Vue.use(mavonEditor);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
