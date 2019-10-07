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

##### 使用

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

*express 解析post请求需要使用body-parser*第三方包来解析*