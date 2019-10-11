define({ "api": [
  {
    "type": "get",
    "url": "/user/login",
    "title": "根据用户名查密码",
    "name": "_user_logi_________",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>用户名称.</p>"
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
  }
] });
