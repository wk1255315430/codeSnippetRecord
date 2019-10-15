##### 安装配置mysql

1. 官网下载zip包，下载解压后创建data文件夹和my.ini文件

2. 配置my.ini文件

   ```
   [mysqld]
   # 设置3306端口
   port=3306
   # 设置mysql的安装目录
   basedir=C:\Program Files\MySQL
   # 设置mysql数据库的数据的存放目录
   datadir=C:\Program Files\MySQL\data
   # 允许最大连接数
   max_connections=200
   # 允许连接失败的次数。
   max_connect_errors=10
   # 服务端使用的字符集默认为utf8
   character-set-server=utf8
   # 创建新表时将使用的默认存储引擎
   default-storage-engine=INNODB
   # 默认使用“mysql_native_password”插件认证
   #mysql_native_password
   default_authentication_plugin=mysql_native_password
   [mysql]
   # 设置mysql客户端默认字符集
   default-character-set=utf8
   [client]
   # 设置mysql客户端连接服务端时默认使用的端口
   port=3306
   default-character-set=utf8
   ```

3. 在安装目录的bin文件夹下运行下面命令初始化mysql，命令执行后会返回初始用户名root和密码，此时复制密码

   ```
   mysqld --initialize --console
   ```

4. 安装mysql服务

   mysqld --install [服务名]（服务名可以不加默认为mysql）

   ```
   mysqld --install
   ```

   如果返回server already exists，说明mysql服务已存在，但这往往是我们之前卸载残留的，在这里需要删除已存在的服务sc delete mysql,返回成功后再重新安装mysql服务

   ```
   sc delete mysql
   ```

5. 启动服务

   ```
   net start mysql
   ```

6. 连接mysql,运行以下命令，然后输入初始化复制的临时密码

   ```
   mysql -u root -p
   ```

7. 重置密码

   ```
   ALTER USER 'root'@'localhost' IDENTIFIED BY '新密码';
   ```

   如果未重置密码，执行sql会报如下错

   ```
   Client does not support authentication protocol requested by server; consider upgrading MySQL client
   ```

8. 最后刷新权限表

   ```
   flush privileges;   //刷新MySQL的系统权限相关表
   ```

   

##### sql语句

- 自定义的字段名，表名最好用反引号包裹，已面与sql关键字冲突。
- 字段值最好用单引号包裹
- 执行完语句navicat不会自动刷新，需要手动刷新查看结果
- =等号在sql中为赋值或判等

1. ##### 插入数据

   ```mysql
   INSERT INTO `tablename`(`filed1`,`filed2`) VALUES(value1，value2);
   ```

2. ##### 批量插入

   ```mysql
   INSERT INTO `tablename`(`filed1`,`filed2`) VALUES(value1，value2),(value1，value2);
   ```

3. ##### 删除表数据

   ```mysql
   DELETE FROM `tablename`
   ```

4. ##### 重置表：作用是删除并重置表，主要在上线时重置或用来恢复主键从0开始

   ```mysql
   TRUNCATE TABLE `tablename`
   ```

5. ##### 查询语句：学习周期占学习所有语句9成时间。

   - 条件查询

     ```mysql
     SELECT * FROM `tablename` WHERE `filed`= value
     ```

6. ##### 存储过程函数

   - 当需要条件判断已执行sql语句时，可以在数据库新建调用存储过程函数或者在后台代码中处理。

   - P_LoginByPhone为函数名
   - 主体部分类似js的function(){} 在sql中用BEGIN和END表示条件成立的语句块

   ```mysql
   //删除已存在的函数
   DROP PROCEDURE IF EXISTS `P_LoginByPhone`;
   //函数的主体部分
   DELIMITER $$
   CREATE PROCEDURE `P_LoginByPhone`
   (
      ...
   )
   BEGIN
   	...
   END;
   $$ DELIMITER;
   ```

   以下是一个创建存储过程的示例：

   ```mysql
   DROP PROCEDURE IF EXISTS `P_LoginByPhone`;
   DELIMITER $$
   CREATE PROCEDURE `P_LoginByPhone`
   (
       _phone varchar(20)
   )
   BEGIN
   	//DECLARE声明一个变量为_name类型为varchar,20字节，默认值为null
   	DECLARE _name varchar(20) DEFAULT NULL;
   	SELECT `name` INTO _name FROM `dt_user` WHERE `phone` = _phone;
   	//条件判断 IS相当于js中的判等（===）
   	IF _name IS NULL THEN
   		INSERT INTO `dt_user`(`name`,`pwd`,`phone`) VALUES (_phone,'123',_phone);
   		//SELECT在if判断中相当于js中的return,AS 为设置别名
   		SELECT _phone AS `phone`;
   	ELSE
   		SELECT _phone AS `phone`;
   	//固定已END IF结束
   	END IF;
   END;
   $$ DELIMITER;
   ```

   调用存储过程

   ```
   CALL P_loginByPhone('15563646873');
   ```

   

7. if条件判断

   ```mysql
   IF _name IS NULL THEN
   	INSERT INTO `dt_user`(`name`,`pwd`,`phone`) VALUES (_phone,'123',_phone);
   	//SELECT在if判断中相当于js中的return
   	SELECT _phone AS `phone`;
   ELSE
   	SELECT _phone AS `phone`;
   	//固定已END IF结束
   END IF;
   ```

   - 课程登录

```mysql
CREATE DEFINER=`root`@`localhost` PROCEDURE `login`(
_email VARCHAR(20),_password VARCHAR(20),_nickname VARCHAR(20)
)
BEGIN
	DECLARE _name VARCHAR(255) DEFAULT NULL;
	DECLARE _count INT(255) DEFAULT 0;
	SELECT `name` INTO _name  FROM `users` WHERE `name` = _email;
	SELECT `count` INTO _count  FROM `users` WHERE `name` = _email;
	IF _name IS NULL then
	INSERT INTO `users`(`name`,`password`,`nickname`,`tel`,`created_at`,`updated_at`,`count`) VALUES(_email,_password,_nickname,null,CURRENT_TIMESTAMP(),CURRENT_TIMESTAMP(),_count);
		SELECT _email AS `name`, _password AS `password`;
	ELSE
		set _count = _count + 1;
		UPDATE `users` SET `count`= _count, `updated_at`= CURRENT_TIMESTAMP() WHERE `name` = _email;
		SELECT _count AS `count`;
	END IF;
	
END
```

- 老李的登录注册sql存储过程

```
DROP PROCEDURE IF EXISTS `P_loginByAdminPwd`;
DELIMITER $$
CREATE PROCEDURE `P_loginByAdminPwd`
(
 _account varchar(20),
 _pwd varchar(20)
)
BEGIN-- 头尾固定，只改名字就行，主要是begin里面的代码
 DECLARE _temp varchar(20) DEFAULT NULL;
 SELECT `pwd` INTO _temp FROM `dt_adminuser` WHERE `name` = _account;
 IF _temp IS NULL THEN
  SELECT '用户名不存在。。' AS 'result';
 ELSE
  IF _temp = _pwd THEN
   SELECT '' AS 'result';
  ELSE
   SELECT '密码错误。。' AS 'result';
  END IF;
 END IF;
END;
$$
DELIMITER ;
```

```mysql
DROP PROCEDURE IF EXISTS `P_loginByPhone`;
DELIMITER $$
CREATE PROCEDURE `P_loginByPhone`
(
 _phone varchar(20)
)
BEGIN-- 头尾固定，只改名字就行，主要是begin里面的代码
 DECLARE _name varchar(20) DEFAULT NULL;-- 定义一个_name类型为varchar，初始值为null
 SELECT `name` INTO _name FROM `dt_user` WHERE `phone` = _phone;
 IF _name IS NULL THEN
  INSERT INTO `dt_user`(`name`,`pwd`,`phone`) VALUES (_phone,'123',_phone);
  SELECT _phone AS `name`;
 ELSE
  SELECT _name AS `name`;
 END IF;
END;
$$
DELIMITER ;
```

