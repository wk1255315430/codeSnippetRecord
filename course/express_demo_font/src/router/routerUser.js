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
    path: "/article/:id",
    name: "article",
    component: () =>
      import(/* webpackChunkName: "about" */ "@/views/users/Markdown.vue")
  }
];
