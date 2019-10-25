var express = require('express');
var router = express.Router();
//数据库
var db = require('../config/mysql')
let articleCount;
let temSql = 'select count(*) from article';
db.query(temSql)
  .then(results => {
    articleCount = results[0]['count(*)'];
  })
/**
 * @api {post} /user/login 验证邮箱并注册登录
 * @apiName /user/logi
 * @apiGroup User
 * @apiHeader {String} Content-Type=application/x-www-form-urlencoded
 * @apiParam { String } email 用户帐号
 * @apiParam { String } emailCode 邮箱验证码或登录密码.
 * @apiParam { String } nickname 用户姓名.
 * @apiSuccess {Object} status 0:密码错误,1：新用户,2：老用户
 * @apiSampleRequest /user/login
 */
router.post('/login', function (req, res, next) {
  let { email, emailCode, nickname } = req.body;
  console.log(req.body);
  let sql = 'CALL login(?,?,?)';
  db.query(sql, [email, emailCode, nickname])
    .then(results => {
      res.json({
        status: true,
        data: results[0]
      })
    })
    .catch(message => {
      res.json({
        status: false,
        data: message
      })
    })
});
/**
 * @api {post} /user/articles 分页查询所有文章列表
 * @apiName /user/articles
 * @apiGroup User
 * @apiHeader {String} Content-Type=application/x-www-form-urlencoded
 * @apiParam { Number } page_number 第几页,一页10篇文章
 * @apiSuccess {String} count 文章总页数
 * @apiSampleRequest /user/articles
 */
router.post('/articles', function (req, res, next) {
  let { page_number } = req.body
  let lines_perpage = 10;
  let page_start = (page_number - 1) * lines_perpage;
  let sql = "SELECT `id`,`title`,`description` FROM article LIMIT ? , ?";
  db.query(sql, [page_start, lines_perpage])
    .then(results => {
      res.json({
        status: true,
        data: results,
        count: articleCount
      })
    })
    .catch(message => {
      res.json({
        status: false,
        data: message
      })
    })
})
/**
 * @api {post} /user/articleById 通过id查询文章,文章为mardown文件
 * @apiName /user/articleById
 * @apiGroup User
 * @apiHeader {String} Content-Type=application/x-www-form-urlencoded
 * @apiParam { Number } id 文章id
 * @apiSampleRequest /user/articleById
 */
router.post('/articleById', (req, res, next) => {
  let { id } = req.body;
  let sql = 'SELECT `id`,`title`,`description`,`content`,`created_at`,`updated_at` FROM article WHERE id = ?'
  db.query(sql, [id])
    .then(results => {
      res.json({
        status: true,
        data: results[0]
      })
    })
    .catch(message => {
      res.json({
        status: false,
        data: message
      })
    })
})
router.post('/socket',(req,res,next)=>{
  let {toId} = req.body;
  console.log(toId)
  res.json({
    data:toId,
    status:1111
  })
  // //连接本地服务
  // let io = require("socket.io-client");
  // console.log(io,'io')
  // let socket = io.connect("ws://localhost");
  // if (toId) {
  //   //发送数据到指定事件
  //   socket.emit('sayTo', {
  //     toId: toId
  //   });
  // } else {
  //   console.log('redirect config is empty');
  // }
})

module.exports = router;
