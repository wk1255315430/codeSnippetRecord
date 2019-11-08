var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
//二级路由设置。引入router文件夹所有自定义的路由处理文件
var adminRouter = require('./routes/admin');
var usersRouter = require('./routes/user');
var app = express();
const requestIp = require('request-ip');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));

// 把post请求传来的参数自动转成json对象，并且附加到req.body属性上
app.use(express.json());

// 把get请求传来的参数自动转成对象，附加在req.query属性上，传来的参数类型会转换成字符串
app.use(express.urlencoded({ extended: false }));

// 默认情况下每次http请求的都会强制携带cookie,这行代码让我们可以使用req.cookie来访问客户端的cookie
app.use(cookieParser());

// 自动分析出请求路由是不是静态资源的请求，如果是会去punlic文件下找到静态资源返还给客户端
// path.join()是路由拼接的方法
app.use(express.static(path.join(__dirname, 'public')));

app.use(requestIp.mw())
// 一级路由设置。针对动态数据请求，将请求路由与服务器开发规划的路由匹配，选择合适的二级路由文件
app.use('/admin', adminRouter);
app.use('/user', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
