// 头，固定写法
var express = require('express');
var router = express.Router();
var db = require('../config/mysql')
var fs = require("fs");
var path = require("path");
let server = {
  host: 'localhost',
  port: 3000,
};
//文件传输
const multer = require('multer');
const upload = multer();
//图片处理
var images = require("images");
//uuid
var uuidv1 = require('uuid/v1');
// 体，可变区域
/**
 * @api {post} /admin/upload/articleImg/ 上传商品主图
 * @apiDescription 上传图片会自动检测图片质量，压缩图片，体积<2M，尺寸（300~1500），存储至articleImg文件夹
 * @apiName upload/articleImg/
 * @apiGroup Upload Image
 * @apiPermission admin
 * 
 * @apiParam {File} file File文件对象;
 * 
 * @apiSampleRequest /admin/upload/articleImg/
 * 
 * @apiSuccess {String} lgImg 返回720宽度图片地址.
 * @apiSuccess {String} mdImg 返回360宽度图片地址.
 */
router.put("/upload/articleImg", upload.single("file"), function (req, res, next) {
  //文件类型
  var type = req.file.mimetype;
  var size = req.file.size;
  //判断是否为图片
  var reg = /^image\/\w+$/;
  var flag = reg.test(type);
  if (!flag) {
    res.status(400).json({
      status: false,
      msg: "格式错误，请选择一张图片!"
    });
    return;
  }
  //判断图片体积是否小于2M
  if (size >= 2 * 1024 * 1024) {
    res.status(400).json({
      status: false,
      msg: "图片体积太大，请压缩图片!"
    });
    return;
  }
  //判读图片尺寸
  var width = images(req.file.buffer).width();
  if (width < 300 || width > 1500) {
    res.status(400).json({
      status: false,
      msg: "图片尺寸300-1500，请重新处理!"
    });
    return;
  }
  //处理原文件名
  var originalName = req.file.originalname;
  var formate = originalName.split(".");
  //扩展名
  var extName = "." + formate[formate.length - 1];
  var filename = uuidv1();
  //储存文件夹
  var fileFolder = "/images/articleImg/";

  images(req.file.buffer)
    .resize(720) //缩放尺寸至720宽
    .save("public" + fileFolder + filename + "_720" + extName, {
      quality: 70 //保存图片到文件,图片质量为70
    });
  res.json({
    status: true,
    msg: "图片上传处理成功!",
    lgImg: fileFolder + filename + "_720" + extName,
  });
})
/**
 * @api {post} /admin/upload/delete/ 删除图片API
 * @apiDescription 如果上传错误的图片，通过此API删除错误的图片
 * @apiName upload/delete/
 * @apiGroup Upload Image
 * @apiPermission admin
 * @apiParam {String} src 图片文件路径,注：src='/images/articleImg/59e13a90-f537-11e9-bcae-3999c5549009_720.jpg';
 * @apiSampleRequest /admin/upload/delete/
 */
router.post('/upload/delete', function (req, res) {
  let realPath = path.join(__dirname, '../public/', req.body.src);
  console.log(realPath, "realPath")
  fs.unlink(realPath, function (err) {
    if (err) {
      return console.log(err);
    }
    res.json({
      status: true,
      msg: "删除成功"
    });
  })
});
/**
 * @api {post} /admin/category 查询所有文章分类
 * @apiName /admin/category
 * @apiGroup admin
 * @apiParam { Number } pId 几级分类
 * @apiSampleRequest /admin/category
 */
router.post('/category', (req, res, next) => {
  let { pId } = req.body;
  let sql = "SELECT * FROM `category` WHERE pId = ?";
  db.query(sql, [pId])
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
 * @api {post} /admin/categoryAdd 添加文章子分类
 * @apiName /admin/categoryAdd
 * @apiGroup admin
 * @apiParam { Number } pId 几级分类,pId为已有的分类
 * @apiSampleRequest /admin/categoryAdd
 */
router.post('/categoryAdd', (req, res, next) => {
  let { pId, name } = req.body;
  let sql = 'INSERT INTO `category`(`name`,`pId`) VALUES(?,?)';
  db.query(sql, [name, pId])
    .then(results => {
      res.json({
        status: true,
        data: results.insertId,
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
 * @api {post} /admin/categoryDel 删除文章子分类
 * @apiName /admin/categoryDel
 * @apiGroup admin
 * @apiParam { Number } id 要删除的分类id
 * @apiSampleRequest /admin/categoryDel
 */
router.post('/categoryDel', (req, res, next) => {
  let { id } = req.body;
  let sql = 'DELETE FROM `category` WHERE id=?';
  db.query(sql, [id])
    .then(results => {
      if (!results.affectedRows) {
        return res.json({
          status: false,
          data: '无此分类'
        })
      }
      res.json({
        status: true,
        data: ''
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
 * @api {post} /admin/categoryUpdate 编辑分类
 * @apiName /admin/categoryUpdate
 * @apiGroup admin
 * @apiParam { Number } id 要修改的分类id
 * @apiParam { String } name 修改后的分类名称
 * @apiSampleRequest /admin/categoryUpdate
 */
router.post('/categoryUpdate',(req,res,next)=>{
  let {name,id} = req.body;
  let sql = 'UPDATE `category` SET `name`=? WHERE id=?';
  db.query(sql,[name,id])
  .then(results=>{
    res.json({
      status:true,
      data:results
    })
  })
  .catch(message=>{
    res.json({
      status:false,
      data:message
    })
  })
})
/**
 * @api {post} /admin/articleAdd 新增文章
 * @apiName /admin/articleAdd
 * @apiGroup admin
 * @apiParam { Number } cid 二级分类id
 * @apiParam { String } title 文章标题
 * @apiParam { String } description 文章描述
 * @apiParam { String } content 文章主体
 * @apiParam { String } images 文章图片，多张图片使用','连接，单张图片不加','
 * @apiParam { String } link 文章链接/来源
 * @apiSampleRequest /admin/articleAdd
 */
router.post('/articleAdd',(req,res,next)=>{
  let {cid,title,description,content,images,link,keywords} = req.body;
  let sql = 'INSERT INTO `article`(`cid`,`title`,`description`,`content`,`created_at`,`updated_at`,`images`,`link`,`keywords`) VALUES(?,?,?,?,CURRENT_TIMESTAMP(),CURRENT_TIMESTAMP(),?,?,?)';
  db.query(sql,[cid,title,description,content,images,link,keywords])
    .then(results=>{
      res.json({
        status:true,
        data:''
      })
    })
    .catch(message=>{
      res.json({
        status:false,
        data:message
      })
    })
})
// 脚，固定写法
module.exports = router;
