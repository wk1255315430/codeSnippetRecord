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
  let { name } = req.query;
  let sql = 'SELECT `password` FROM `users` WHERE `name` = ?';
  db.query(sql, [name], (results, fields) => {
    if (!results.length) {
      return res.json({
        status: false,
        msg: '查询失败',
        data: null
      })
    };
    res.json({
      status: true,
      msg: '查询成功',
      data: results
    })
  })
});
module.exports = router;
