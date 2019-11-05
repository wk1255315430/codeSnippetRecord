资源网站：[李文周博客](www.liwenzhou.com)

## 环境配置

1. go官网下载安装包，并假设安装到`D:\go`
2. 在环境变量里，新建一项：`GOPATH:D:\www\go`，项目目录`D:\www\go`
3. 在安装目录下的`D:\go\bin`目录添加到环境变量`PATH`里面
4. 在项目目录下新建三个文件夹，分别是：`bin`、`src`、`pkg`

### 编译

1. 在项目文件下执行`go build`,编译后的文件在放在执行的目录下
2. `go bulid -o 自定义名称`

### go run

执行go代码

###  go install

表示安装的意思，它先编译源代码生成可执行文件，然后把文件移动到`GOPATH`下bin目录中

### 交叉编译

Go支持跨平台编译，只需要执行对应的命令、window下执行一下操作：

```
SET CGO_ENABLED=0 //禁用CGO
SET GOOS=linux //编译目标为linux平台
SET GOARCH=amd64 //目标处理架构是amd64
```

执行`go bulid`就编译为linux平台运行的程序了

### 字符串

go语言中字符串必须要`""`包裹,`''`单引号包裹的是字符

### 指针

`&`（取地址）和`*`（根据地址取值）