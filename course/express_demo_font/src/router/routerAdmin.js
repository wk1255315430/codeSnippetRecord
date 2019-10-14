// 管理员路由
export default [
  {
    path: "/",
    name: "home",
    component: () => import(/* webpackChunkName: "home" */ "@/views/Home.vue")
  },
  {
    path: "/about",
    name: "about",
    meta: { requiredAuth: true },
    component: () => import(/* webpackChunkName: "about" */ "@/views/About.vue")
  }
];
