## 内置模块
##### morgan

--是express默认的日志中间件

##### crypto

--加密解密模块

##### jade

--摸板解析模块（jade代码反人类）一般用不到动它以及更换它

 #### 错误处理

 * 同步：try catch捕获, 不然后面代码不会执行
 * 异步：callback回调


``` 
 const fs = require('fs');  //fs为内置文件模块

 let dirs = fs.readdirSync('./targetDirNanme');
 console.log('目标目录不存在的情况下')  //目标文件不存在时,此行代码不会执行。
```

 同步通过try catch进行捕获错误，保持代码的健壮性：


``` 
 const fs = require('fs');  //fs为内置文件模块

    try{let dirs = fs.readdirSync('./targetDirNanme')};
    catch(error){
        console.log(error)
    }
 console.log('目标目录不存在的情况下')  //目标文件不存在时,此行代码也会执行。
```

 异步读取：


``` 
 const fs = require('fs');  //fs为内置文件模块

 let dirs = fs.readdir('./targetDirNanme',(error,data)=>{
     error?console.log(error):console.log(data)
 });
 console.log('目标目录不存在的情况下')  //目标文件不存在时,此行代码不会执行
```

 ## 第三方模块

##### nodemailer 

> 邮件发送模块，到达上限smtp限制登录，`qq`:52  `163`:76 ,到达上限将smtp将限制登录，发送邮箱将收到邮件提醒
>
> ```
> 454 4.7.0 Too many login attempts, please try again later. l33sm4798981pgb.79 - gsmtp //到达52
> ```

##### request 

> 自己服务器去调用其他服务器的接口，发送http请求

##### serve-favicon

> 设置浏览器标签页网站logo的模块

##### multer

> 用于上传文件

##### request-ip

> 获取客户端ip

##### puppeteer

> 爬虫 可以饶过反爬虫规则，能够通过devtool控制headless模式的chrome或者chromium，它可以在headless模式下模拟任何的人为操作。

##### cheerio

> 爬虫 不能饶过反爬虫规则

```vue
#vue
methods: {
    // 绑定@imgAdd event
    $imgAdd(pos, $file) {
      // 第一步.将图片上传到服务器.
      const formdata = new FormData();
      formdata.append("file", $file);
      axios({
        url: "/admin/upload/articleImg",
        method: "put",
        data: formdata,
        headers: { "Content-Type": "" }
      }).then(url => {
        // 第二步.将返回的url替换到文本原位置![...](./0) -> ![...](url)
        /**
         * $vm 指为mavonEditor实例，可以通过如下两种方式获取
         * 1.  通过引入对象获取: `import {mavonEditor} from ...` 等方式引入后，`$vm`为`mavonEditor`
         * 2. 通过$refs获取: html声明ref : `<mavon-editor ref=md ></mavon-editor>，`$vm`为 `this.$refs.md`
         * 3. 由于vue运行访问的路径只能在static下，so，我就把图片保存到它这里了
         */
        // this.$refs.md.$img2Url(pos, 'http://localhost:8002/static/image/' + url.data.data)
      });
      console.log(formdata);
    }
  }
```

![1571728039450](C:\Users\ThinkPad\Desktop\codeSnippetRecord\note\1571728039450.png)

```
#nodejs
const multer = require('multer');
const upload = multer();
router.put("/upload/articleImg", upload.single("file"), function (req, res, next) {
  console.log(req.file, req.body, 'req')
  res.json({
    data: "ok"
  })
})
```

![1571728105366](C:\Users\ThinkPad\Desktop\codeSnippetRecord\note\1571728105366.png)



##### jsonwebtoken

> 加密和生成用户token

##### express-jwt

> 作为中间件验证token

##### mysql

> 用来操作数据库的模块，而不是存方数据的数据库

##### mavon-editor

> markdown的编辑器

##### markdown-it-vue

> 展示markdown文件的包

## 包的缓存和全局文件夹

 首先在nodejs的安装目录下新建两个文件夹node_globl和node_cache

-  设置通过npm全局安装的文件路径

  ```
  npm config set prefix "C:\Program Files\nodejs\node_global"
  ```

- 设置通过npm安装包的缓存文件的保存路径

  ```
  npm config set cache "C:\Program Files\nodejs\node_cache"
  ```


## 接受数据

​	get req.query

​	post req.body(使用body-parser)

#### 请求体（body-parser）

只有nodejs需要安装body-parser，express默认使用body-parser作为请求体解析中间件

##### 简介

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

## crypto加密解密：aes-256-cbc对称加密

```javascript
#untils/crypto.js

const crypto = require('crypto');
// AES对称加解密 http://nodejs.cn/api/crypto.html#crypto_hash_update_data_inputencoding
// AES 有三种长度 128位、192位、256位，这三种的区别，主要来自于密钥的长度，16字节密钥=128位，24字节密钥=192位，32字节密钥=256位
const key = '63c005dbcc70cea58f2143f619cc6a3f'; //32位
const iv = '63c005dbcc70cea5'; //16位
const algorithm = 'aes-256-cbc'

function decrypt(data) {
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(data, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted
}
function encrypt(data) {
    const cipheriv = crypto.createCipheriv(algorithm, key, iv)
    let encrypted = cipheriv.update(data, 'utf8', 'hex');
    encrypted += cipheriv.final('hex');
    return encrypted
}
module.exports = {
    encrypt,
    decrypt,
    crypto
}
```

<font color=Blue>对称加密目前主流的有AES和DES，AES是新一代的标准，速度快，安全级别更高。</font>

### AES 

AES的加密模式(model)有五种：CBC、ECB、CTR、OCF、CFB

1. ECB：电子密本方式，需要一个密钥即可，特点是简单，利于并行计算。
2. CBC：密文分组链接方式，除了需要一个密钥之外，还需要一个向量，向量的作用也是用于数据的加密，所以这个的安全性要好于 ECB
3. CTR、OCF、CFB：具体算法的实现方式不一样，优缺点也各不相同，而这几个都同 CBC 一样，都需要密钥和向量。

> AES 有三种长度 128位、192位、256位，这三种的区别，主要来自于密钥的长度，16字节密钥=128位，24字节密钥=192位，32字节密钥=256位。如下表格：

| 长度  | 密钥长度(key) | 向量长度(vi) |
| :---: | :-----------: | :----------: |
| 128位 |      16       |      16      |
| 192位 |      24       |      16      |
| 256位 |      32       |      16      |

### DES

加密默认与 AES 相同，也有五种模式，除了 ECB 只需要密钥，其他模式需要密钥和向量。

与 AES 不同的是， DES 的密钥长度只有8字节，向量也是8字节。