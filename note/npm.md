查询本机全局安装的包

```
npm list -g --depth=0
```

配置安装包的缓存以及全局安装文件夹

```
// 替换成nodejs的安装目录加手动创建的文件夹后执行命令，命令参考下面。
npm config set cache "C:\Program Files\nodejs\node_cache"
npm config set prefix "C:\Program Files\nodejs\node_global"
```

