// 管理员路由
export default [
  {
    path: "/admin",
    name: "admin",
    meta: { requiredAuth: true },
    component: () =>
      import(/* webpackChunkName: "admin" */ "@/views/admin/Admin.vue")
  },
  {
    path: "/admin/article",
    name: "article",
    meta: { requiredAuth: true },
    component: () =>
      import(/* webpackChunkName: "admin" */ "@/views/admin/Article.vue")
  }
];
