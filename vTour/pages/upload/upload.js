// pages/upload/upload.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    count: 0,
    isIdle: false,
    photos: "../images/add.png",
    photoNum: '',
    tourCertificate: '',
    date: '',
    tourLv: ['初级', '中级', '高级', '特级'],
    index: 0,
    language: '',
    route: '',
    years: '',
    resume: ''
  },

  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  //获取导游资格证号
  tourCertificateInput(e) {
    var that = this
    that.setData({
      tourCertificate: e.detail.value
    })
  },
  //获取导游擅长语种
  languageInput(e) {
    var that = this
    that.setData({
      language: e.detail.value
    })
  },
  //获取导游从业年限
  yearsInput(e) {
    var that = this
    that.setData({
      years: e.detail.value
    })
  },
  //获取导游擅长路线
  routeInput(e) {
    var that = this
    that.setData({
      route: e.detail.value
    })
  },
  //获取导游个人简介
  resumeInput(e) {
    var that = this
    that.setData({
      resume: e.detail.value
    })
  },
  //导游等级
  bindDateChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  //是否空闲
  changeIdleState: function(e) {
    var that = this;
    var flag = e.detail.value;
    console.log(flag)
    if (this.data.isIdle == true) {
      that.setData({
        isIdle: false
      })
      this.updateLeisureState(0)
    } else {
      that.setData({
        isIdle: true
      })
      this.updateLeisureState(1)
    }
  },
  // leisure / updateLeisureState
  updateLeisureState: function(e) {
    var that = this
    wx.request({
      url: app.globalData.url + '/leisure/updateLeisureState',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: {
        userWxId: app.globalData.userWxId,
        type: e
      },
      success: function(res) {
        if (!res.data.success) {
          console.log("false")
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000,
            mask: false
          })
        } else {
          console.log("true")
          if (e == 1) {
            console.log("f")
            wx.navigateTo({
              // url: 'pages/user/schedule/schedule'
              url: '../user/schedule/schedule'
            })
          }

        }
      }
    })
  },
  toData: function() {
    wx.navigateTo({
      url: '../user/schedule/schedule?startDate=' + this.data.startDate + '&endDate=' + this.data.endDate,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    wx.request({
      url: app.globalData.url + '/leisure/queryTourInfo',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: {
        userWxId: app.globalData.userWxId
      },
      success: function(res) {
        if (res.data) {
          console.log(res.data)
          that.setData({
            tourCode: res.data.tourCode,
            name: res.data.name,
            photos: res.data.url
          })
        }
        if (res.data.line) {
          that.setData({
            route: res.data.line
          })
        }
        if (res.data.tourDictateCode) {
          that.setData({
            tourCertificate: res.data.tourDictateCode
          })
        }
        if (res.data.level) {
          that.setData({
            index: res.data.level
          })
        }
        if (res.data.language) {
          that.setData({
            language: res.data.language
          })
        }
        if (res.data.intro) {
          that.setData({
            resume: res.data.intro
          })
        }
        if (res.data.years) {
          that.setData({
            years: res.data.years
          })
        }
        // if (res.data.leisure) {
        //   if (res.data.leisure == 1) {
        //     that.setData({
        //       isIdle: true
        //     })
        //     wx.request({
        //       url: app.globalData.url + '/leisure/queryLeisureInfo',
        //       header: {
        //         "content-type": "application/x-www-form-urlencoded"
        //       },
        //       method: "POST",
        //       data: {
        //         userWxId: app.globalData.userWxId
        //       },
        //       success: function(res) {
        //         if (res.data) {
        //           console.log(res.data)
        //           that.setData({
        //             startDate: res.data.startDate,
        //             endDate: res.data.endDate
        //           })

        //         }
        //       }
        //     })
        //   }
        // }

      }
    })
  },
  //选择照片
  photoBtn: function(e) {
    var _this = this
    _this.setData({
      count: 0
    })
    wx.chooseImage({
      count: 1, // 最多可以选择的图片张数，默认9
      sizeType: ['compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], //album 从相册选图，camera 使用相机，默认二者都有
      success: function(photo) {
        console.log(photo)
        _this.setData({
          photos: photo.tempFilePaths,
          photoNum: photo.tempFilePaths.length
        })

      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete

      }
    })
  },
  save() {
    var index = this.data.index
    console.log(this)
    var that = this

    var data = {
      tourCode: that.data.tourCode,
      tourDictateCode: that.data.tourCertificate,
      tourLine: that.data.route,
      tourLevel: that.data.index,
      tourLanguage: that.data.language,
      tourIntro: that.data.resume,
      touryears: that.data.years
    }
    var dataStr = JSON.stringify(data)
    console.log(dataStr)
    wx.request({
      url: app.globalData.url + '/leisure/addTourInfo',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: {
        json: dataStr
      },
      success: function(result) {
        wx.switchTab({
          url: '/pages/user/user',
        })
      }
    })
  },
  /**
   * 上传照片
   */
  uploadImg: function() {
    var that = this
    var list = this.data.photos;
    console.log(list)
    if (list[0] == "../images/ui/shangChuan.png") {
      wx.navigateBack({})
      return
    }
    var i = 0;
    for (i; i < list.length; i++) {
      var filename = list[i].replace("http://tmp/", "")
      filename = filename.replace("wxfile://", "")
      var photoUrl = 'https://yoleyo.oss-cn-beijing.aliyuncs.com/teamAssemble/' + filename;
      if (i < list.length) {
        wx.request({
          url: app.globalData.url + '/teamAssemble/updatePhoto',
          data: {
            teamCode: app.globalData.teamCode,
            userWxId: app.globalData.userWxId,
            assembleDate: that.data.assembleDate,
            assembleTime: that.data.assembleTime,
            photoUrl: photoUrl,
            index: i
          },
          method: 'post',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function(res) {
            if (res.data.success) {

            }
          },
          fail: function(res) {
            console.log("--------fail--------");
          }
        })
      }

      wx.uploadFile({
        url: 'https://yoleyo.oss-cn-beijing.aliyuncs.com', //上传的路径
        filePath: list[i],
        name: 'file',
        formData: {
          name: filename,
          key: "teamAssemble/" + filename, //上传图片的名字和路径（默认路径根目录，自定义目录：xxx/xxx.png）
          policy: "eyJleHBpcmF0aW9uIjoiMjAyMC0wMS0wMVQxMjowMDowMC4wMDBaIiwiY29uZGl0aW9ucyI6W1siY29udGVudC1sZW5ndGgtcmFuZ2UiLDAsMTA0ODU3NjAwMF1dfQ==",
          OSSAccessKeyId: "LTAItSFEreZuxQY5",
          success_action_status: "200",
          signature: "SnbYS2pRuyKfVYS6KxYXM5eXO58=",
        },
        success: function(res) {
          console.log(res)

        },
        fail: function({
          errMsg
        }) {
          console.log('upladImage fail, errMsg is: ', errMsg)
          wx.showToast({
            title: "上传失败",
            duration: 1000
          })
        },
      })
      console.log(i)

    }
    if (i == list.length) {
      wx.hideLoading();
      wx.navigateBack({

      })
      return
    }

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (this.data.count != 0) {
      var that = this
      that.onLoad("show")
    }
    this.setData({
      count: 1
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})