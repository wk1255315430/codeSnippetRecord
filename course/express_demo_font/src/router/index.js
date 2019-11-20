import Vue from "vue";
import Router from "vue-router";
Vue.use(Router);
import routerAdmin from "./routerAdmin";
import routerUser from "./routerUser";
import $store from "../store";
const router = new Router({
  routes: [...routerAdmin, ...routerUser]
});

router.beforeEach((to, from, next) => {
  // 刷新页面前保存vuex中数据
  window.addEventListener("beforeunload", () => {
    sessionStorage.setItem("token", $store.getters["token"]);
  });
  if (!$store.getters["token"]) {
    $store.commit("beforEunload", sessionStorage.getItem("token"));
    sessionStorage.removeItem("token");
  }
  if (to.matched.some(record => record.meta.requiredAuth)) {
    if (!$store.getters["token"]) {
      next({
        path: "/login",
        query: {
          redirect: to.fullPath
        }
      });
      return;
    }
    // 已登录
    next();
  } else {
    next();
  }
});
export default router;
