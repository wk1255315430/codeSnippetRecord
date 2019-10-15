var express = require('express');
var router = express.Router();
//数据库
var db = require('../config/mysql')
/**
 * @api {post} /user/login 验证邮箱并注册登录
 * @apiName /user/logi 邮箱验证
 * @apiGroup User
 * @apiHeader {String} Content-Type=application/x-www-form-urlencoded
 * @apiParam { String } email 用户帐号
 * @apiParam { String } emailCode 邮箱验证码或登录密码.
 * @apiParam { String } nickname 用户姓名.
 * @apiSuccess {Object} status 0:密码错误,1：新用户,2：老用户
 * @apiSampleRequest /user/login
 */
router.post('/login', function (req, res, next) {
  let { email,emailCode,nickname} = req.body;
  console.log(req.body);
  let sql = 'CALL login(?,?,?)';
  db.query(sql, [email,emailCode,nickname], (results, fields) => {
    if (!results.length) {
      return res.json({
        status: false,
        data: null
      })
    };
    res.json({
      status: true,
      data: results[0]
    })
  })
});
module.exports = router;
