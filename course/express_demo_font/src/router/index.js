import Vue from "vue";
import Router from "vue-router";
Vue.use(Router);
import routerAdmin from "./routerAdmin";
import routerUser from "./routerUser";
const router = new Router({
  routes: [...routerAdmin, ...routerUser]
});

// router.beforeEach((to, from, next) => {
//   if (to.matched.some(record => record.meta.requiredAuth)) {
//     // 无token,未登录
//     if (!sessionStorage.token) {
//       next({
//         path: "/login",
//         query: {
//           redirect: to.fullPath
//         }
//       });
//       return;
//     }
//     // 已登录
//     next();
//   } else {
//     next();
//   }
// });
export default router;
