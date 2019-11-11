// pages/addUserInfo/addUserInfo.js
const app = getApp();
var amapFile = require('../../utils/amap-wx.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userType: '',
    userName: '',
    userSex: '',
    userCode: '',
    userPhone: '',
    tourTravel: '',
    tourCode: '',
    userCheckState: '',
    hotelName: '',
    hotelDress: '',
    introducerCode: '',
    mark: '',
    editState: true,
    editStateTourist: true,
    editStateTour: true,
    editStateHotel: true,
    userAddressNow:'',
    userPhoneTravel:'',
    userAddressInputPcc:'',
    userAddressInputCity:'',
    userAddress:''
  },
  //获取用户输入的备注
  markInput: function (e) {
    var that = this
    that.setData({
      mark: e.detail.value
    })
  },
  //获取用户输入的省
  userAddressInputPcc(e){
    var that = this
    that.setData({
      userAddressInputPcc: e.detail.value
    })
  },
  //获取用户输入的市
  userAddressInputCity(e) {
    var that = this
    that.setData({
      userAddressInputCity: e.detail.value
    })
  },
  //获取用户输入的详细地址
  userAddressInput(e) {
    var that = this
    that.setData({
      userAddress: e.detail.value
    })
  },
  //获取用户选择的类别
  radioTypeChange: function (e) {
    var that = this
    that.setData({
      userType: e.detail.value
    })
  },
  //获取用户输入的姓名
  userNameInput: function (e) {
    var that = this
    that.setData({
      userName: e.detail.value
    })
  },
  //获取用户选择的性别
  radioSexChange: function (e) {
    var that = this
    that.setData({
      userSex: e.detail.value
    })
  },
  editStateChange() {
    var that = this
    that.setData({
      editState: false,
      editStateTourist: false,
      editStateTour: false,
      editStateHotel: false
    })
    console.log(that.data.editState)
  },
  //获取用户输入的身份证号码
  userCodeInput: function (e) {
    var that = this
    that.setData({
      userCode: e.detail.value
    })
  },
  //获取用户输入的手机号码
  userPhoneInput: function (e) {
    var that = this
    that.setData({
      userPhone: e.detail.value
    })
  },
  //获取用户输入的旅行社
  tourTravelInput: function (e) {
    var that = this
    that.setData({
      tourTravel: e.detail.value
    })
  },
  //获取用户输入的导游证号
  tourCodeInput: function (e) {
    var that = this
    that.setData({
      tourCode: e.detail.value
    })
  },
  //获取邀请人邀请码发红包用  introducerCode
  introducerCodeInput: function (e) {
    var that = this
    that.setData({
      introducerCode: e.detail.value
    })
  },
  //获取用户输入的宾馆名称
  // hotelNameInput: function (e) {
  //   var that = this
  //   that.setData({
  //     hotelName: e.detail.value
  //   })
  // },
  // //获取用户输入的宾馆地址
  // hotelDressInput: function (e) {
  //   var that = this
  //   that.setData({
  //     hotelDress: e.detail.value
  //   })
  // },
  //返回
  cancel: function () {
    wx.navigateBack({

    })
  },
  isNull: function (str) {
    if (str == "") return true;
    var regu = "^[ ]+$";
    var re = new RegExp(regu);
    //为空或纯空格为 true    有值为false
    return re.test(str);
  },

  //保存个人信息
  saveUserInfo: function () {
    var userType = this.data.userType
    if (userType == 1 && app.globalData.userState == 1) {
      wx.showToast({
        title: '审核通过用户不允许再次修改！！或联系客服进行修改！！',
        icon: 'none',
        duration: 2000,
        mask: false
      })
      return
    }
    if (userType == 1 &&
      (this.isNull(this.data.tourTravel) == true ||
        this.isNull(this.data.tourCode) == true ||
        this.isNull(this.data.userCode) == true ||
        this.isNull(this.data.userPhone) == true ||
        this.isNull(this.data.userName) == true)) {
      wx.showToast({
        title: '导游用户：姓名、身份证号、手机号、旅行社、导游证号必填',
        icon: 'none',
        duration: 2000,
        mask: false
      })
      return
    } else if (userType==3 &&
    this.isNull()){

    }
    else if (userType == 2 && (
      this.isNull(this.data.userPhone) == true ||
      this.isNull(this.data.hotelName) == true ||
      this.isNull(this.data.hotelDress) == true)) {
      wx.showToast({
        title: '宾馆用户：电话号码（订房电话）、宾馆名称、地址必填',
        icon: 'none',
        duration: 2000,
        mask: false
      })
      return
    } else if (userType == 0 &&
      this.isNull(this.data.userName) == true) {
      var userinfo = app.globalData.userInfo.nickName
      this.setData({
        userName: userinfo
      })
    }
    wx.request({
      url: app.globalData.url + '/user/update',
      data: {
        userWxId: app.globalData.userWxId,
        userType: userType,
        userName: this.data.userName,
        userSex: this.data.userSex,
        userCode: this.data.userCode,
        userPhone: this.data.userPhone,
        tourTravel: this.data.tourTravel,
        tourCode: this.data.tourCode,
        userCheckState: this.data.userCheckState,
        hotelName: this.data.hotelName,
        hotelDress: this.data.hotelDress,
        introducerCode: this.data.introducerCode,
        userUrl: app.globalData.userInfo.avatarUrl,
        mark: this.data.mark
      },
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {

        if (res.data.success) {
          app.globalData.userType = res.data.userType
          wx.navigateBack({

          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000,
            mask: false
          })
        }


      },
      fail: function (res) {
        console.log("--------fail--------");
      }
    })
  },


 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var myAmapFun = new amapFile.AMapWX({ key: 'f149525102fd153e6f12230efd1996bf' });
    //获取位置省市区
    myAmapFun.getRegeo({
      success: function (res) {
        // app.globalData.pccCode = res[0].regeocodeData.addressComponent.adcode.substring(0, 4);
        that.setData({
          pcccode: res[0].regeocodeData.addressComponent.adcode.substring(0, 4),
          city: res[0].regeocodeData.addressComponent.city,
        })
      }
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
          app.globalData.userType = res.data.userType
          app.globalData.userState = res.data.userCheckState
          that.setData({
            userType: res.data.userType,
            userName: res.data.userCodeName,
            userSex: res.data.userSex,
            userCode: res.data.userCode,
            userPhone: res.data.userPhone,
            tourTravel: res.data.userTourTravel,
            tourCode: res.data.userTourCode,
            userCheckState: res.data.userCheckState,
            userMark: res.data.userMark
          })
          console.log('user' + res.data.userTourIntroducer)
          if (res.data.userType == 0) {
            that.setData({
              editStateTourist: false
            })
          } else if (res.data.userType == 1) {
            that.setData({
              editStateTour: false
            })
          } else if (res.data.userType == 2) {
            that.setData({
              editStateHotel: false
            })
          }
        }
        if (res.data.userType == 2) {
          //查询酒店信息
          wx.request({
            url: app.globalData.url + '/sysHotel/queryHotel',
            data: {
              wxId: app.globalData.userWxId
            },
            method: 'post',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              // if (res.data.sysHotelName == undefined) {
              //   that.setData({
              //     hotelPhone: res.data.sysHotelPhone,
              //     hotelName: res.data.sysHotelPhone,
              //     hotelDress: res.data.sysHotelPhone
              //   })
              //   that.saveHotel('')
              // } else {
              that.setData({
                hotelName: res.data.sysHotelName,
                hotelDress: res.data.sysHotelDress
              })
              // }

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
    }),
      function ObjData(key, value) {
        this.Key = key;
        this.Value = value;
      }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})