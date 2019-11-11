##### vue安装

- 安装vue-cli脚手架

```
npm install -g @vue/cli  #终端执行安装 Vue-CLI'
vue -V                   #查看版本已检查是否安装成功
```

- 使用脚手架搭建项目环境

```
vue create <Project Name> #创建项目文件名不支持驼峰（含大写字母）
```

- 安装配置选项

  ```
  '配置选项'
  default (babel, eslint)   #默认套餐，提供 [babel]和 [eslint]
  Manually select features  #手动配置
  ```

  - Manually

    ```
    ? Check the features needed for your project: (Press <space> to select, <a> to toggle all, <i> to invert selection)
    >( ) TypeScript                                 // JavaScript的一个超集（添加了可选的静态类型和基于类的面向对象编程：类型批注和编译时类型检查、类、接口、模块、lambda 函数）
     ( ) Progressive Web App (PWA) Support          // 渐进式Web应用程序
     ( ) Router                                     // vue-router（vue路由）
     ( ) Vuex                                       // vuex（vue的状态管理模式）
     ( ) CSS Pre-processors                         // CSS 预处理器（如：less、sass）
     ( ) Linter / Formatter                         // 代码风格检查和格式化（如：ESlint）
     ( ) Unit Testing                               // 单元测试（unit tests）
     ( ) E2E Testing                                // e2e（end to end） 测试
    ```

    1. ​	Router路由选择

       ```
       ? Check the features needed for your project: Babel, Router, Vuex, CSS Pre-proce
       ssors, Linter
       ? Use history mode for router? (Requires proper server setup for index fallback 
       in production) No
       ```

        首先会让你选择是否使用history router：Vue-Router 利用了浏览器自身的hash 模式和 history 模式的特性来实现前端路由（通过调用浏览器提供的接口）

       hash： 浏览器url址栏 中的 # 符号（如这个 URL：http://www.abc.com/#/hello，hash 的值为“ #/hello”），hash 不被包括在 HTTP 请求中（对后端完全没有影响），因此改变 hash 不会重新加载页面

       history：利用了 HTML5 History Interface 中新增的 pushState() 和 replaceState() 方法（需要特定浏览器支持）

    2.  css pre-processors

       ```
       ? Please pick a preset: Manually select features
       ? Check the features needed for your project: Router, Vuex, CSS Pre-processors, Linter, Unit
       ? Pick a CSS pre-processor (PostCSS, Autoprefixer and CSS Modules are supported by default):
         SCSS/SASS  //Sass安装需要Ruby环境，是在服务端处理的，SCSS 是 Sass3新语法（完全兼容 CSS3且继承Sass功能）
         LESS       //Less最终会通过编译处理输出css到浏览器，Less 既可以在客户端上运行，也可在服务端运行 (借助 Node.js)
        > Stylus     //Stylus主要用来给Node项目进行CSS预处理支持，Stylus功能上更为强壮，和js联系更加紧密，可创建健壮的、动态的的CSS。
       ```

       css预处理器：主要为css解决浏览器兼容、简化CSS代码 等问题

    3. Linter / Formatter  JS代码检查

       ```
       ? Pick a linter / formatter config: (Use arrow keys)
         ESLint with error prevention only  //只有错误预防
         ESLint + Airbnb config   //Airbnb 配置
       > ESLint + Standard config  //标准配置
         ESLint + Prettier         //使用较多  (漂亮的配置)
       ```

       选择了js代码检查后，接着让选择什么时候检查js代码

       ```
       ? Pick additional lint features: (Press <space> to select, <a> to toggle all, <i> to invert selection)
       >( ) Lint on save                    // 保存就检测
        ( ) Lint and fix on commit          // fix和commit时候检查
       ```

       

    4. Unit Testing 单元测试

       ```
       ? Pick a unit testing solution: (Use arrow keys)
       Mocha + Chai  //mocha灵活,只提供简单的测试结构，如果需要其他功能需要添加其他库/插件完成。必须在全局环境中安装
         Jest          //安装配置简单，容易上手。内置Istanbul，可以查看到测试覆盖率，相较于Mocha:配置简洁、测试代码简洁、易于和babel集成、内置丰富的expect
       ```

    5. 如何存放以上的配置

       ```
       ? Where do you prefer placing config for Babel, PostCSS, ESLint, etc.? (Use arrow keys)
       > In dedicated config files // 独立文件放置
         In package.json // 放package.json里
       ```

    6. 是否保存本次配置（之后可以直接使用）：

       ```
       ? Save this as a preset for future projects? (Y/n) // y:记录本次配置，然后需要你起个名; n：不记录本次配置
       ```

##### vue-cli3和vue-cli2搭建的区别

在3代中，webpack的配置已经被脚手架默认了，并不会显示。如果我们需要手动配置webpack的一些配置，可以在根目录下，手动创建配置文件---vue.config.js



