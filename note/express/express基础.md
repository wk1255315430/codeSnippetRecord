#### 接受数据

​	get req.query

​	post req.body(使用body-parser)

#### 请求体（body-parser）

##### 	简介

- nodejs body请求的解析中间件
- 提供四种解析器
  1. JSON body parser 
  2. Raw body parser
  3. Text body parser
  4. URL-encoded form body parser

##### 使用body-parser

```
npm install body-parser --save
```



```javascript
//server.js
var express = require('express')
var bodyParser = require('body-parser')

const localPort = 3000
var app = express()

// create application/json parser
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })


app.post('/login.do', (req, res) => {
    console.log('********************')
    console.log(req.body)

    res.end();
})
app.post('/login.do', jsonParser, (req, res) => {
    console.log('********************')
    console.log(req.body)

    res.end();
})
app.post('/login.do', urlencodedParser, (req, res) => {
    console.log('********************')
    console.log(req.body)

    res.end();
})

app.listen(localPort, () => {
    console.log('http://127.0.0.1:%s', host, port)
})
```

*express 解析post请求需要使用body-parser*第三方包来解析

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

