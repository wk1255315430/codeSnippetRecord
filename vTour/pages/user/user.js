//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    userReward: '0.0',
    isChecked: false,
    isIdle: false,
    tourCode: '',
    code: '',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    count: 0,
    isRed: false,
    type: 0,
  },
  //是否显示导游位置
  changeSwitch: function (e) {
    var that = this;
    var flag = e.detail.value;
    if (this.data.isChecked == true) {
      that.setData({
        isChecked: false
      })

    } else {
      that.setData({
        isChecked: true
      })
    }
    //是否显示位置
    wx.request({
      url: app.globalData.url + "/user/isShow",
      data: {
        isChecked: this.data.isChecked,
        userWxId: app.globalData.userWxId
      },
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {

      },
      fail: function (res) {
        console.log("--------fail--------");
      }
    })
  },
  //是否空闲
  changeIdleState: function (e) {
    var that = this;
    var flag = e.detail.value;
    if (this.data.isIdle == true) {
      that.setData({
        isIdle: false
      })
    } else {
      that.setData({
        isIdle: true
      })
    }
    //是否空闲
    wx.request({
      url: app.globalData.url + "/user/isIdle",
      data: {
        isIdle: this.data.isIdle,
        userWxId: app.globalData.userWxId
      },
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {

      },
      fail: function (res) {
        console.log("--------fail--------");
      }
    })
  },
  //日程安排
  schedule() {
    // wx.showLoading({
    //   mask: true
    // })
    //查询有无日程有则返回对象，无则返回0
    //后台查询导游有无完善个人信息
    // wx.request({
    //   url: app.globalData.url + '',
    //   header: {
    //     "content-type": "application/x-www-form-urlencoded"
    //   },
    //   method: "POST",
    //   data: {
    //     userWxId: app.globalData.userWxId,
    //   },
    //   success: function (result) {

    //     wx.navigateTo({
    //       url: '../upload/upload',
    //     })
    // wx.navigateTo({
    //   url: 'schedule/schedule'
    // })
    // if (result.data.success) {
    //   wx.navigateTo({
    //     url: 'schedule/schedule'
    //   })
    // } else {
    // } 
    //   }
    // })
    wx.navigateTo({
      url: '../calendar/calendar',
    })


  },
  //跳转号
  goTo: function () {

  },
  //使用说明
  // Instructions: function () {
  //   wx.navigateTo({
  //     url: '../goToPublic/goToPublic'
  //   })
  // },
  //历史队伍页面按钮跳转
  oldTeam: function (e) {
    wx.navigateTo({
      url: '../oldTeam/oldTeam',
    })
  },
  //完善个人信息
  addUserInfo: function () {
    wx.navigateTo({
      url: '../addUserInfo/addUserInfo'
    })
  },
  //登录按钮
  // login() {
  //   wx.reLaunch({
  //     url: '../authorization/authorization'
  //   })
  // },
  //完善宾馆信息
  hotelInfo: function () {
    wx.navigateTo({
      url: '../hotelPass/hotelPass'
    })
  },
  //积分系统
  point: function () {
    // wx.showToast({
    //   title: '此功能即将开放！！',
    //   icon: 'none',
    //   duration: 2000,
    //   mask: false
    // })
    // wx.navigateTo({
    //   url: '../point/point'
    // })

    wx.showLoading({
      mask: true
    })
    var user = this.data.userInfo
    wx.setStorage({
      key: 'user',
      data: this.data.userInfo,
      success: function (res) {

      }
    })
    wx.request({
      url: app.globalData.url + '/queryMall/queryMall',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: {
        code: 1
      },
      success: function (result) {

        var list = result.data
        var data = {
          listStr: list,
          userStr: user
        }
        var dataStr = JSON.stringify(data)
        wx.hideLoading()
        wx.navigateTo({
          url: '../point/point?data=' + dataStr
        })
      }
    })

  },
  //红包提现
  reward: function () {
    var sum = this.data.userReward + this.data.userIntroducerReward
    wx.navigateTo({
      url: '../user/reward/reward?tourCode=' + this.data.tourCode + '&reward=' + this.data.userReward + '&userIntroducerReward=' + this.data.userIntroducerReward + '&sum=' + sum
    })
  },
  //意见反馈
  idea: function () {
    wx.showToast({
      title: '此功能即将开放！！',
      icon: 'none',
      duration: 2000,
      mask: false
    })
  },
  //打电话
  calling: function (e) {
    wx.makePhoneCall({
      phoneNumber: '05386638529'
    })
  },
  //领红包
  red: function (e) {
    var that = this
    wx.request({
      url: app.globalData.url + '/packet/query',
      data: {
        tourCode: that.data.tourCode
      },
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res)
        if (res.data != "") {
          wx.request({
            url: app.globalData.url + '/wxPay',
            data: {
              tourCode: res.data.user_tour_code,
              introducerCode: res.data.user_tour_introducer
            },
            method: 'post',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {

              if (res.data.return_code == "SUCCESS" && res.data.result_code == "SUCCESS") {
                that.setData({
                  totalAmount: res.data.total_amount,
                  sendListid: res.data.act_name,
                  isRed: false
                })
                //用户界面显示红包信息
                wx.showModal({
                  title: res.data.act_name,
                  content: (res.data.total_amount / 100.00) + '元红包已发放，请前往微信领取',
                  showCancel: false,
                })

              }
            },
            fail: function (res) {
              console.log("--------fail--------");
            }
          })
        }
      },
      fail: function (res) {
        console.log("--------fail--------");
      }
    })
  },
  onLoad: function (options) {
    var that = this
    console.log('id:' + app.globalData.userWxId)
    that.setData({
      type: app.globalData.userType
    })
    wx.request({
      url: app.globalData.url + '/user/query',
      data: {
        userWxId: app.globalData.userWxId
      },
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data != "") {
          wx.setStorage({
            key: 'userPoints',
            data: res.data.userPoints,
            success: function (res) {
              console.log('异步保存成功')
            }
          })
          //查询是否开启定位
          if (res.data.isShowAdress == 1) {
            that.setData({
              isChecked: true
            })
          }
          //查询是否空闲
          if (res.data.isIdle == 1) {
            that.setData({
              isIdle: true
            })
          }

          if (res.data.userPoints < 5000) {
            that.setData({
              levelImg: "../images/v1.png"
            })
          }
          if (res.data.userPoints >= 5000 && res.data.userPoints < 10000) {
            that.setData({
              levelImg: "../images/v2.png"
            })
          }
          if (res.data.userPoints >= 10000 && res.data.userPoints < 15000) {
            that.setData({
              levelImg: "../images/v3.png"
            })
          }
          if (res.data.userPoints >= 15000 && res.data.userPoints < 20000) {
            that.setData({
              levelImg: "../images/v4.png"
            })
          }
          if (res.data.userPoints >= 20000) {
            that.setData({
              levelImg: "../images/v5.png"
            })
          }

          that.setData({
            userReward: res.data.userReward,
            userIntroducerReward: res.data.userIntroducerReward,
            userPoints: res.data.userPoints,
            userType: res.data.userType,
            userCheckState: res.data.userCheckState,
            tourCode: res.data.userTourCode
          })

          //导游用户查询是否有红包需要领取
          if (res.data.userType == 1 && res.data.userCheckState == 1) {
            wx.request({
              url: app.globalData.url + '/packet/query',
              data: {
                tourCode: res.data.userTourCode
              },
              method: 'post',
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              success: function (res) {

                if (res.data != "") {
                  that.setData({
                    isRed: true
                  })
                } else {
                  that.setData({
                    isRed: false
                  })
                }
              },
              fail: function (res) {
                console.log("--------fail--------");
              }
            })
          }
        }
      },
      fail: function (res) {
        console.log("--------fail--------");
      }
    })
    var count = 0
    if (app.globalData.userInfo) {
      this.setData({
        userType: app.globalData.userType,
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else
      if (this.data.canIUse) {
        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        // 所以此处加入 callback 以防止这种情况
        app.userInfoReadyCallback = res => {

          //   console.log("else if"+res.data);
          //   console.log(code);
          //   //发起网络请求
          //   wx.request({
          //     url:'http://localhost:8888/user/add',
          //     header: {
          //       "content-type": "application/x-www-form-urlencoded"
          //     },
          //     method: "POST",
          //     data: {
          //       encryptedData: res.encryptedData,
          //       iv: res.iv,
          //       code: code
          //     },
          //     success: function (result) {
          //       // wx.setStorage({
          //       //   key: 'openid',
          //       //   data: res.data.openid,
          //       // })
          //       console.log(result)
          //     }
          //   })
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      } else {
        // 在没有 open-type=getUserInfo 版本的兼容处理
        wx.getUserInfo({
          success: res => {
            app.globalData.userInfo = res.userInfo
            // //发起网络请求
            // wx.request({
            //   url: '/http://localhost:8888/user/add',
            //   header: {
            //     "content-type": "application/x-www-form-urlencoded"
            //   },
            //   method: "POST",
            //   data: {
            //     encryptedData: res.encryptedData,
            //     iv: res.iv,
            //     code: code
            //   },
            //   success: function (result) {
            //     // wx.setStorage({
            //     //   key: 'openid',
            //     //   data: res.data.openid,
            //     // })
            //     console.log(result)
            //   }
            // })
            this.setData({
              userInfo: res.userInfo,
              hasUserInfo: true
            })
          }
        })
      }
  },
  onShow: function () {
    if (this.data.count != 0) {
      var that = this
      that.onLoad("show")
    }
    this.setData({
      count: 1
    })
  }
})