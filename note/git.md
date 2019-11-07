### 合并冲突

```
git add.
git commit -m "合并" //把未合并的代码上传本地版本库
git fetch //更新远程仓库文件
git diff master origin/master //本地文件和远程仓库文件进行对比
git merge origin/master //自动合并
手动删除不必要的代码
git add .
git commit -m "合并后" //把合并后的代码上传本地版本库
git push origin master //本地版本推送到远程仓库
```



