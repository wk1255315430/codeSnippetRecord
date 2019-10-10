// 头，固定写法
var express = require('express');
var router = express.Router();

// 体，可变区域
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// 脚，固定写法
module.exports = router;
