// 管理员路由
export default [
  {
    path: "/admin",
    name: "管理后台",
    meta: { requiredAuth: true },
    component: () =>
      import(/* webpackChunkName: "admin" */ "@/views/admin/Admin.vue"),
    children: [
      {
        path: "/admin/article",
        name: "文章发布",
        meta: { requiredAuth: true },
        component: () =>
          import(/* webpackChunkName: "admin" */ "@/views/admin/Article.vue")
      },
      {
        path: "/admin/category",
        name: "分类",
        meta: { requiredAuth: true, keepAlive: true },
        component: () =>
          import(/* webpackChunkName: "admin" */ "@/views/admin/Category.vue")
      }
    ]
  },
  {
    path: "/login",
    name: "登录",
    component: () =>
      import(/*webpackChunkName:"login" */ "@/views/admin/Login.vue")
  }
];
