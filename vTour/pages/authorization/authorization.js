const app = getApp();
Page({
  data: {
    type: 0,
    code:"",
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function () {
    var that = this;
    if (!wx.canIUse('button.open-type.getUserInfo')){
      wx.showToast({
        title: '微信版本太低，请升级后重新打开！！！',
        icon: 'none',
        duration: 2000,
        mask: false
      })
      return 
    }
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log("code:" +res.code)
        this.setData({
          code: res.code
        })
      }
    })
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.showLoading({
            title: '数据加载中。。。',
            mask: true,
          })
          wx.getUserInfo({
            success: function () {
              //从数据库获取用户信息
              that.queryUsreInfo("查询用户");
             
             
            }
          });
        }
      }
    })
  },

  bindGetUserInfo: function (e) {
    wx.showLoading({
      title: '数据加载中。。。',
      mask: true,
    })
    if (e.detail.userInfo) {
      var that = this;
      //用户按了允许授权按钮
          //发起网络请求
          wx.request({
            url: app.globalData.url + '/user/add',
            header: {
              "content-type": "application/x-www-form-urlencoded"
            },
            method: "POST",
            data: {
              encryptedData: e.detail.encryptedData,
              iv: e.detail.iv,
              code: that.data.code,
              appid: app.globalData.appid,
              secret: app.globalData.secret
            },
            success: function (result) {
              if (!result.data.openid || result.data.openid == null || result.data.openid == '') {
                that.bindGetUserInfo(e);
              }else{
                  app.globalData.userWxId = result.data.openid,
                  app.globalData.userType = result.data.userType,
                  app.globalData.userState = result.data.userState,
                  app.globalData.userInfo = e.detail.userInfo,
                  app.globalData.hasUserInfo = true,
                  //授权成功后，跳转进入小程序首页
                  setTimeout(function () {
                    wx.switchTab({
                      url: '/pages/user/user'
                    })
                    wx.hideLoading();
                  }, 2000)
               
              }
             
            }
          })
        　　　　　
      　　　　
      
    } else {
      wx.hideLoading()
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击了“返回授权”')
          }
        }
      })
    }
  },
  //获取用户信息接口
  queryUsreInfo: function (e) {
    wx.showLoading({
      title: '数据加载中。。。',
      mask: true,
    })
    var that = this
    wx.request({
      url: app.globalData.url +'/user/add',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: {
        encryptedData: "",
        iv: "",
        code: that.data.code,
        appid: app.globalData.appid,
        secret: app.globalData.secret

      },
      success: function (result) {
        if (!result.data.openid || result.data.openid == null || result.data.openid == ''||result.data.openid=="null"){
          that.queryUsreInfo("重新获取openId");
        }else{
          app.globalData.userWxId = result.data.openid,
            app.globalData.userType = result.data.userType,
            app.globalData.userState = result.data.userState
         

          //用户已经授权过
          setTimeout(function () {
            wx.switchTab({
              url: '/pages/home/home'
            })
            wx.hideLoading();
          }, 2000)
        } 
      }
    }) 
  }

})
