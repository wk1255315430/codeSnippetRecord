define({ "api": [
  {
    "type": "post",
    "url": "/admin/upload/articleImg/",
    "title": "上传商品主图",
    "description": "<p>上传图片会自动检测图片质量，压缩图片，体积&lt;2M，尺寸（300~1500），存储至articleImg文件夹</p>",
    "name": "upload_articleImg_",
    "group": "Upload_Image",
    "permission": [
      {
        "name": "admin"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "File",
            "optional": false,
            "field": "file",
            "description": "<p>File文件对象;</p>"
          }
        ]
      }
    },
    "sampleRequest": [
      {
        "url": "/admin/upload/articleImg/"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "lgImg",
            "description": "<p>返回720宽度图片地址.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "mdImg",
            "description": "<p>返回360宽度图片地址.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/admin.js",
    "groupTitle": "Upload_Image"
  },
  {
    "type": "post",
    "url": "/admin/upload/delete/",
    "title": "删除图片API",
    "description": "<p>如果上传错误的图片，通过此API删除错误的图片</p>",
    "name": "upload_delete_",
    "group": "Upload_Image",
    "permission": [
      {
        "name": "admin"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "src",
            "description": "<p>图片文件路径,注：src='/images/articleImg/59e13a90-f537-11e9-bcae-3999c5549009_720.jpg';</p>"
          }
        ]
      }
    },
    "sampleRequest": [
      {
        "url": "/admin/upload/delete/"
      }
    ],
    "version": "0.0.0",
    "filename": "routes/admin.js",
    "groupTitle": "Upload_Image"
  },
  {
    "type": "post",
    "url": "/user/articleById",
    "title": "通过id查询文章,文章为mardown文件",
    "name": "_user_articleById",
    "group": "User",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "defaultValue": "application/x-www-form-urlencoded",
            "description": ""
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>文章id</p>"
          }
        ]
      }
    },
    "sampleRequest": [
      {
        "url": "/user/articleById"
      }
    ],
    "version": "0.0.0",
    "filename": "routes/user.js",
    "groupTitle": "User"
  },
  {
    "type": "post",
    "url": "/user/articles",
    "title": "分页查询所有文章列表",
    "name": "_user_articles",
    "group": "User",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "defaultValue": "application/x-www-form-urlencoded",
            "description": ""
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "page_number",
            "description": "<p>第几页,一页10篇文章</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "count",
            "description": "<p>文章总页数</p>"
          }
        ]
      }
    },
    "sampleRequest": [
      {
        "url": "/user/articles"
      }
    ],
    "version": "0.0.0",
    "filename": "routes/user.js",
    "groupTitle": "User"
  },
  {
    "type": "post",
    "url": "/user/keyWord",
    "title": "获取所有二级分类",
    "name": "_user_keyWord",
    "group": "User",
    "sampleRequest": [
      {
        "url": "/user/keyWord"
      }
    ],
    "version": "0.0.0",
    "filename": "routes/user.js",
    "groupTitle": "User"
  },
  {
    "type": "post",
    "url": "/user/keyWord",
    "title": "获取所有二级分类",
    "name": "_user_keyWord",
    "group": "User",
    "sampleRequest": [
      {
        "url": "/user/keyWord"
      }
    ],
    "version": "0.0.0",
    "filename": "routes/user.js",
    "groupTitle": "User"
  },
  {
    "type": "post",
    "url": "/user/login",
    "title": "验证邮箱并注册登录",
    "name": "_user_logi",
    "group": "User",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "defaultValue": "application/x-www-form-urlencoded",
            "description": ""
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>用户帐号</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "emailCode",
            "description": "<p>邮箱验证码或登录密码.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "nickname",
            "description": "<p>用户姓名.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "status",
            "description": "<p>0:密码错误,1：新用户,2：老用户</p>"
          }
        ]
      }
    },
    "sampleRequest": [
      {
        "url": "/user/login"
      }
    ],
    "version": "0.0.0",
    "filename": "routes/user.js",
    "groupTitle": "User"
  },
  {
    "type": "post",
    "url": "/admin/articleAdd",
    "title": "新增文章",
    "name": "_admin_articleAdd",
    "group": "admin",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "cid",
            "description": "<p>二级分类id</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": "<p>文章标题</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>文章描述</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "content",
            "description": "<p>文章主体</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "images",
            "description": "<p>文章图片，多张图片使用','连接，单张图片不加','</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "link",
            "description": "<p>文章链接/来源</p>"
          }
        ]
      }
    },
    "sampleRequest": [
      {
        "url": "/admin/articleAdd"
      }
    ],
    "version": "0.0.0",
    "filename": "routes/admin.js",
    "groupTitle": "admin"
  },
  {
    "type": "post",
    "url": "/admin/category",
    "title": "查询所有文章分类",
    "name": "_admin_category",
    "group": "admin",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "pId",
            "description": "<p>几级分类</p>"
          }
        ]
      }
    },
    "sampleRequest": [
      {
        "url": "/admin/category"
      }
    ],
    "version": "0.0.0",
    "filename": "routes/admin.js",
    "groupTitle": "admin"
  },
  {
    "type": "post",
    "url": "/admin/categoryAdd",
    "title": "添加文章子分类",
    "name": "_admin_categoryAdd",
    "group": "admin",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "pId",
            "description": "<p>几级分类,pId为已有的分类</p>"
          }
        ]
      }
    },
    "sampleRequest": [
      {
        "url": "/admin/categoryAdd"
      }
    ],
    "version": "0.0.0",
    "filename": "routes/admin.js",
    "groupTitle": "admin"
  },
  {
    "type": "post",
    "url": "/admin/categoryDel",
    "title": "删除文章子分类",
    "name": "_admin_categoryDel",
    "group": "admin",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>要删除的分类id</p>"
          }
        ]
      }
    },
    "sampleRequest": [
      {
        "url": "/admin/categoryDel"
      }
    ],
    "version": "0.0.0",
    "filename": "routes/admin.js",
    "groupTitle": "admin"
  },
  {
    "type": "post",
    "url": "/admin/categoryUpdate",
    "title": "编辑分类",
    "name": "_admin_categoryUpdate",
    "group": "admin",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>要修改的分类id</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>修改后的分类名称</p>"
          }
        ]
      }
    },
    "sampleRequest": [
      {
        "url": "/admin/categoryUpdate"
      }
    ],
    "version": "0.0.0",
    "filename": "routes/admin.js",
    "groupTitle": "admin"
  }
] });
