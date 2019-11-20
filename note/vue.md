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

### 打包部署404

如果vue.config.js使用了proxy代理如下：

```javascript
#错误时示例
proxy: {
      "/api": {
        target: "http://127.0.0.1:3000/", //对应自己的接口
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          "^/api": ""
        }
      }
    }
```

##### 问题分析：

~~在打包后的接口请求则都加上了`/api`,可能是`pathRewrite`失效了，但最大的可能是打包环境默认加上的`api`,~~

~~因为`proxy:{}`是在`devServer:{}`下的~~ `devServer`只作用dev，在pro中不作用，以上代码意思是在开发环境中遇到请求地址开头`/api`的进行代理到`http://127.0.0.1:3000/`,设置允许跨域和开启websockets，重写请求地址，遇到以`/api`开头的就替换成未空。404问题实际是`axios`默认请求地址加上了`/api`所有就出现了在pro和dev请求地址相斥情况如在dev中前台**Request URL**为`http://127.0.0.1:3000/api/api/user/articleById`，后台接收为`/api/user/articleById`，而不是`/user/articleById`,原因则为设置了axios默认的`axios.defaults.baseURL:/api`

##### 解决

后台接口加上`/api`配备一级路由，前台请求地址为`/api/user/articleById`

```
#app.js
app.use('/api/admin', adminRouter);

#vue.config.js
proxy: {
      "/api": {
        target: "http://127.0.0.1:3000",
        changeOrigin: true,
        ws: true
      },
      "/images": {
        target: "http://127.0.0.1:3000",
        changeOrigin: true
      }
    }
```

### Vue部署

​	~~生成的`dist`目录下的文件要放在`public`目录下，因为`public`目录下还有自定义的`images`文件，所以要想同时访问两个文件夹需要如下设置~~ `app.use(express.static(path.join(__dirname, 'public')));`该语法可堆叠使用：

```javascript
//这样设置能访问dist文件夹下的资源，又能访问其他public下的images下的文件资源了
app.use(express.static(path.join(__dirname, 'public/images')));
app.use(express.static(path.join(__dirname, 'public/dist'))); 
```

### 刷新页面保存vuex中的数据

![](C:\Users\ThinkPad\Desktop\codeSnippetRecord\note\vue.assets\1574005843352.png)

```javascript
import Vue from "vue";
import axios from "./utils/axios";
import Vuex from "vuex";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: ""
  },
  getters: {
    token(state) {
      return state.token;
    }
  },
  mutations: {
    _getToken(state, payload) {
      state.token = payload;
    },
    beforEunload(state, payload) {
      state.token = payload;
    }
  },
  actions: {
    getToken(context, payload) {
      return new Promise(resolve => {
        axios.post("/api/user/bmsl", payload).then(({ data: res }) => {
          if (res.status) {
            context.commit("_getToken", res.token);
            resolve(res);
          }
        });
      });
    }
  }
});

```



```js
# app.vue
created() {
    window.addEventListener("beforeunload", () => {
      sessionStorage.setItem("token", this.token);
    });
    if (!this.token) {
      this.$store.commit("beforEunload", sessionStorage.getItem("token"));
      sessionStorage.removeItem("token");
    }
  }
```

> `window.addEventListener("beforeunload", callback);` 刷新页面前触发，页面刷新把vuex中的state数据存储到sessionStorage中，当刷新页面时，组件进入生命周期销毁前(`beforeDestroy()`)，vuex中的state将全部销毁，页面刷新完毕后，接着进入组件生命周期的`created()`,判断vuex的state为空时,触发`mutations` 更改state值为缓存中的token值，并随后删除缓存中的token.这样不管怎么刷新vuex中的state并不会丢失，缓存也不会存有token(严格意义上会存后删除,闪一下，这里的缓存应该加密存储)。
>
> 注意：事件监听函数作用在<font color="red">全局导航守卫</font>后面，还有<font color="red">safri</font>的监听时间对象为`pagehide`

### 对称加密

```javascript
const CryptoJS = require("crypto-js");

//加密方法 参考链接https://code.google.com/archive/p/crypto-js/
const key = CryptoJS.enc.Utf8.parse("63c005dbcc70cea58f2143f619cc6a3f");
const iv = CryptoJS.enc.Utf8.parse("63c005dbcc70cea5");
/**
 * AES 有三种长度 128位、192位、256位，这三种的区别，主要来自于密钥的长度，16字节密钥=128位，24字节密钥=192位，32字节密钥=256位
 * 长度	 密钥长度  向量长度
   128位	16	    16
   192位	24	    16
   256位	32	    16
 *iv：在crypto-js使用初始化向量(iv)时，自动生成256位的密钥
 *CryptoJS supports AES-128, AES-192, and AES-256. It will pick the variant by the size of the key you pass in. If you use a passphrase, then it will generate a 256-bit key.
 *mode：在cryppto-js中,加密方式有CBC (the default) CFB CTR OFB ECB
 *padding: 在cryppto-js中，填充种类有Pkcs7 (the default) Iso97971 AnsiX923 Iso10126 ZeroPadding NoPadding
 * @param {*} data //加密的字符串
 * @returns 密文
 */
function Encrypt(data) {
  let srcs = CryptoJS.enc.Utf8.parse(data);
  let encrypted = CryptoJS.AES.encrypt(srcs, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  return encrypted.ciphertext.toString();
}
// 解密
function Decrypt(data) {
  let encryptedHexStr = CryptoJS.enc.Hex.parse(data);
  let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
  let decrypt = CryptoJS.AES.decrypt(srcs, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
  return decryptedStr.toString();
}

export default {
  Decrypt,
  Encrypt
};

```

