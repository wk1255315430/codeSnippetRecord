var express = require('express');
var router = express.Router();
//数据库
var db = require('../config/mysql')
/**
 * @api {get} /user/login 根据用户名查密码
 * @apiName /user/logi 上传微信用户信息
 * @apiGroup User
 * 
 * @apiParam { String } username 用户名称.
 * 
 * @apiSampleRequest /user/login
 */
router.get('/login', function (req, res, next) {
  let {username} = req.query;
  let sql = 'SELECT password FROM users WHERE username = ?';
  db.query(sql, [username], function (result, fields) {
    res.json({
      status: false,
      msg: '查询成功',
      data:result
    })
  })
});
module.exports = router;