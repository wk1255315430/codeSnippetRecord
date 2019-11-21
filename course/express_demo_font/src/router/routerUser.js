// 管理员路由
export default [
  {
    path: "/",
    name: "home",
    component: () =>
      import(/* webpackChunkName: "about" */ "@/views/users/Home.vue")
  },
  {
    path: "/article/:id",
    name: "article",
    component: () =>
      import(/* webpackChunkName: "about" */ "@/views/users/Markdown.vue")
  },
  {
    path: "/test",
    name: "测试",
    component: () =>
      import(/* webpackChunkName: "about" */ "@/views/users/Test.vue")
  }
];
