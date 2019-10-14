

#### 安装express

```
npm install express -g
```

#### 安装express-generator（脚手架）

​	安装它的目的是为了运行 express命令 

```
npm install express-generator -g
```

#### 安装依赖

​	将当前工作目录下的package.json文件中的dependencies节点下的所有包依次自动进行局部安装

```
npm install
```

#### 启动项目

```
npm start
```

#### 目录文件介绍

1. package.json

   文件主要给npm用

   dependencies节点下记录了当前所有依赖的第三方包信息（包名、包的版本号）

2. public

   主要存放当前网站服务器的静态资源文件（html文件、css文件、js文件、图片文件、音频视频文件、字体图标文件等)

3. app.js

   是网站服务器处理请求的一级路由文件，每行代码都得明白作用。俗称服务器的大脑，代码解析在项目express_demo中

4. routes

   存放处理动态数据请求的核心文件

5. bin/www文件

   项目的入口文件，有端口配置。入口文件在package.json的script节点下的start的值里配置

#### 服务端缓存

当用户查看像分类列表或首页那种不常变并且每个用户看的都一样的内容时，服务端可以在启动时就从数据库把所有的分类请求回来放在后台的变量里面，客户端每次请求二级分类时，则在变量里面查询并返回数据。当然像分类列表最应该放在客户端进行缓存。

#### 模块配置

##### mysql连接池配置

- 连接池一次建立多个连接，解决了每次请求都创建结束造成的时间和性能上的缓慢
- 具体配置说明见npmjs中mysql介绍

1. 在config文件夹下新建文件mysql.js，并写入如下代码

   ```js
   // config/mysql.js
   const mysql = require('mysql');
   var pool = mysql.createPool({
       connectionLimit: 10,
       host: 'localhost',
       user: 'root',
       password: 'root',
       database: 'express_demo',
       multipleStatements: true,
       debug:true,
   });
   //常规SQL
   let query = function(sql, arr = [], callback) {
       //建立链接
       pool.getConnection(function(err, connection) {
           if (err) throw err;
           connection.query(sql, arr, function(error, results, fields) {
               //将链接返回到连接池中，准备由其他人重复使用
               connection.release();
               if (error) throw error;
               //执行回调函数，将数据返回
               callback && callback(results, fields);
           });
       });
   };
   module.exports = {
       query,
       pool
   }
   ```

2. 路由文件中使用新建的mysql.js

   ```js
   // router/user.js
   
   var express = require('express');
   var router = express.Router();
   //数据库
   var db = require('../config/mysql')
   /**
    * @api {get} /user/login 根据用户名查密码
    * @apiName /user/logi 上传微信用户信息
    * @apiGroup User
    * 
    * @apiParam { String } username 用户名称.
    * 
    * @apiSampleRequest /user/login
    */
   router.get('/login', function (req, res, next) {
     let {username} = req.query;
     let sql = 'SELECT password FROM users WHERE username = ?';
     db.query(sql, [username], function (result, fields) {
       res.json({
         status: false,
         msg: '查询成功',
         data:result
       })
     })
   });
   module.exports = router;
   ```

   