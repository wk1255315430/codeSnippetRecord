var express = require('express');
var router = express.Router();
const jwt = require("jsonwebtoken");
//数据库
var db = require('../config/mysql')
var nodemailer = require('../config/mailer')
const cryptoAES = require('../untils/crypto')
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
  let ip = req.clientIp;
  let sql = 'CALL login(?,?,?,?)';
  db.query(sql, [email, emailCode, nickname, ip])
    .then(results => {
      res.json({
        status: true,
        data: results[0],
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
  let sql = "SELECT `id`,`title`,`content` FROM article ORDER BY `updated_at` DESC LIMIT ? , ?";
  db.query(sql, [page_start, lines_perpage])
    .then(results => {
      res.json({
        status: true,
        data: results
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
  let sql = 'SELECT `id`,`title`,`description`,`content`,`created_at`,`updated_at` ,`keyWords`,`content_type`,`link` FROM article WHERE id = ?'
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
/**
 * @api {post} /user/articleView 记录查看次/人数
 * @apiName /user/articleView
 * @apiGroup User
 * @apiParam { Number } id 文章id
 * @apiSampleRequest /user/articleView
 */
router.post('/articleView', (req, res, next) => {
  let { id } = req.body;
  db.query('CALL article_hot(?)', [id])
    .then(results => {
      res.json({
        status: true,
        data: ''
      })
    })
    .catch(message => {
      res.json({
        status: true,
        data: message
      })
    })
})
/**
 * @api {post} /user/articleHot 获取3/7/30天内的热门文章
 * @apiName /user/articleHot
 * @apiGroup User
 * @apiParam { Number } day 天数,天数不传为查看总榜
 * @apiParam { Number } page_number 查看的页数，每页默认为10
 * @apiSampleRequest /user/articleHot
 */
router.post('/articleHot', (req, res, next) => {
  let { day, page_number } = req.body;
  let params = [day]
  let lines_perpage = 10;
  let page_start = (page_number - 1) * lines_perpage;
  let sql;
  let sqla = 'SELECT `id`,`title`,`content` FROM `article` ORDER BY `count` DESC LIMIT ?,?' //总榜/限制榜：排序分页 总榜不需要知道count (day, page_number)
  let sqlb = 'SELECT count(*) FROM article WHERE DATE_SUB(CURDATE(), INTERVAL ? DAY) <= date(updated_at) ORDER BY `count` DESC' //限制榜：count (day)
  let sqlC = 'SELECT `id`,`title`,`content` FROM article WHERE DATE_SUB(CURDATE(), INTERVAL ? DAY) <= date(updated_at) ORDER BY `count` DESC LIMIT ?,?' //限制榜：排序分页 (day, page_number)
  if (!day) {
    sql = sqla
    params = [page_start, lines_perpage]
  } else {
    if (!page_number) {
      sql = sqlb;
    } else {
      sql = sqlC;
      params.push(page_start, lines_perpage);
    }
  }
  db.query(sql, params)
    .then(results => {
      if (!day) {
        res.json({
          status: true,
          data: results
        })
      } else {
        if (!page_number) {
          res.json({
            status: true,
            data: "",
            count: results[0]['count(*)']
          })
        } else {
          res.json({
            status: true,
            data: results
          })
        }
      }

    })
    .catch(message => {
      res.json({
        status: false,
        data: message
      })
    })
})
router.post('/socket', (req, res, next) => {
  let { toId } = req.body;
  console.log(toId)
  res.json({
    data: toId,
    status: 1111
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
/**
 * @api {post} /user/keyWord 获取所有二级分类
 * @apiName /user/keyWord
 * @apiGroup User
 * @apiSampleRequest /user/keyWord
 */
router.get('/keyWords', (req, res, next) => {
  let sql = "SELECT id,`name`	FROM category WHERE pid!=0";
  db.query(sql, [])
    .then(results => {
      res.json({
        status: true,
        data: results
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
 * @api {post} /user/relationArticle 获取相关文章
 * @apiName /user/relationArticle
 * @apiParam { String } keyWords 关键字
 * @apiGroup User
 * @apiSampleRequest /user/relationArticle
 */
router.post('/relationArticle', (req, res, next) => {
  let { keyWords } = req.body;
  let sql = 'select id,title from article where concat(title,description,content) REGEXP ?';
  db.query(sql, [keyWords])
    .then(results => {
      res.json({
        status: true,
        data: results
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
 * @api {post} /user/search 搜索文章
 * @apiName /user/search
 * @apiParam { String } queryString 搜索内容
 * @apiGroup User
 * @apiSampleRequest /user/search
 */
router.post('/search', (req, res, next) => {
  let { queryString } = req.body;
  let sql = "select id,title from article where concat(title) REGEXP ?";
  db.query(sql, [queryString])
    .then(results => {
      res.json({
        status: true,
        data: results
      })
    })
    .catch(message => {
      res.json({
        status: false,
        data: message
      })
    })
})
router.post('/bmsl', (req, res, next) => {
  let { uname, pwd } = req.body;
  uname = cryptoAES.decrypt(uname)
  pwd = cryptoAES.decrypt(pwd)
  let sql = 'SELECT `uname` FROM `admins` WHERE `uname` = ? AND `pwd` = ?'
  db.query(sql, [uname, pwd])
    .then(results => {
      if (results.length) {
        const hmac = cryptoAES.crypto.createHmac('sha256', 'hubery');
        let ret = hmac.update(uname);
        ret = hmac.digest('hex')
        let token = jwt.sign({ token: ret }, 'secret', { expiresIn: '1h' })
        res.json({
          status: true,
          data: '登录成功',
          token: token
        })
      } else {
        res.status(404).json({
          status: false,
          data: '登录失败',
        })
      }
    })
    .catch(message => {
      res.json({
        status: false,
        data: message
      })
    })
})
module.exports = router;
