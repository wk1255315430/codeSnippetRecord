// 管理员路由
export default [
  {
    path: "/admin",
    name: "admin",
    meta: { requiredAuth: true },
    component: () =>
      import(/* webpackChunkName: "about" */ "@/views/admin/Admin.vue")
  }
];
