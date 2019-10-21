// 管理员路由
export default [
  {
    path: "/",
    name: "home",
    meta: { requiredAuth: true },
    component: () =>
      import(/* webpackChunkName: "about" */ "@/views/users/Home.vue")
  },
  {
    path: "/test",
    name: "test",
    component: () =>
      import(/* webpackChunkName: "about" */ "@/views/users/Markdown.vue")
  }
];
