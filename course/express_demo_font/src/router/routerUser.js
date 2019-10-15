// 管理员路由
export default [
  {
    path: "/",
    name: "home",
    meta: { requiredAuth: true },
    component: () => import(/* webpackChunkName: "about" */ "@/views/Home.vue")
  }
];
