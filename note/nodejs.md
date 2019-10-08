## 内置模块
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

​	nodemailer 邮件发送模块

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

  