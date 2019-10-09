// pages/fountTo/foundTo.js
var util = require('../../utils/util.js')
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userType:'',
    searchText: '',
    imgUrls: [
      'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
      'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640',
      'https://images.unsplash.com/photo-1551446591-142875a901a1?w=640'
    ],
    days: [],
    clickState: false,
    dayStyle: [],
    yearMonth: '',
    isShow: false,
    dateStart: '',
    dateEnd: '',
    dateSt: '',
    metters: ['济泰曲', '京津翼'],
    lv: ['初级', '中级', '高级', '特级'],
    mettersIndex: 0,
    lvIndex: 0,
    items: [
      {
        name:'张三',
        line:'济泰曲',
        
      },
      {
        name: '张三',
        line: '济泰曲'
      },
      {
        name: '张三',
        line: '济泰曲'
      },
      {
        name: '张三',
        line: '济泰曲'
      },
      {
        name: '张三',
        line: '济泰曲'
      },
      {
        name: '张三',
        line: '济泰曲'
      },
      {
        name: '张三',
        line: '济泰曲'
      }
      ],
    isShowState:0,
    showDialog: false,
    callGetPhone: '18263460426',
    tourItem: {
      img: 'https://yoleyo.oss-cn-beijing.aliyuncs.com/yoleyoClient/01fea8eeae68acfd5e7ef997070ecd4c.jpeg',
      name: '测试名称',
      zigeCard: 'j1234567',
      tourCard: 'q1234567',
      metters: '济泰区',
      lv: '高级',
      phone: '18263460426',
      longTime: '2010.09',
      lgu: '汉语',
      jj: '个人与天蝎',

    },
   
    lang: ['汉语', '英语', '法语', '俄语', '西班牙语', '阿拉伯语'],
    metters: ['济泰曲', '京津翼'],
    longTime: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    lv: ['初级', '中级', '高级', '特级'],
    // lang:'',
    item: {}
  },
  //删除数组元素
  remove: function (array, val) {
    for (var i = 0; i < array.length; i++) {
      if (array[i] == val) {
        array.splice(i, 1);
      }
    }

  },
  //查找数组元素
  includes(array, item) {
    for (var i = 0; i < array.length; i++) {
      if (array[i] == item) {
        return 'true'
      } else {
        return 'false'
      }
    }
  },
  /**
   * 点击日期
   */
  dayClick: function (e) {
    var that = this

    let clickDay = e.detail.day;
    let year = e.detail.year
    let month = e.detail.month
    var dayStyle = that.data.dayStyle
    var days = that.data.days

    for (var i = 0; i < days.length; i++) {
      if (clickDay == days[i]) {
        that.setData({
          clickState: true
        })
      }
    }
    if (that.data.clickState) {
      that.remove(days, clickDay)

      for (var i = 0; i < dayStyle.length; i++) {
        if (dayStyle[i].day == clickDay) {
          dayStyle.splice(i, 1);
        }
      }
    } else {
      var obj = {
        month: 'current',
        day: (clickDay + '').length == 1 ? '0' + clickDay : clickDay + '',
        color: 'white',
        background: 'red',
      }
      dayStyle.push(obj)
      days.push(obj.day)

    }
    that.setData({
      dayStyle: dayStyle,
      clickState: false
    })
  },
  /**
   * 点击下一个月按钮
  */
  next(e) {
    var that = this
    var year = e.detail.prevYear + ''
    var month = e.detail.prevMonth + ''
    var currentYear = e.detail.currentYear + ''
    var currentMonth = e.detail.currentMonth + ''

    if (month.length == 1) {
      month = '0' + month
    }
    if (currentMonth.length == 1) {
      currentMonth = '0' + currentMonth
    }
    var yearMonth = year + month
    var currentYearMonth = currentYear + currentMonth
    that.setData({
      yearMonth: currentYearMonth
    })
    var userDate = that.data.days
    //后台保存上月 发送obj
    that.addTourLeisureDate(yearMonth, userDate, currentYearMonth)

  },
  /**
   * 点击上月按钮
   */
  prev(e) {
    var that = this

    var currentYear = e.detail.currentYear + ''
    var currentMonth = e.detail.currentMonth + ''
    var prevMonth = e.detail.prevMonth + ''
    var prevYear = e.detail.prevYear + ''
    if (currentMonth.length == 1) {
      currentMonth = '0' + currentMonth
    }
    if (prevMonth.length == 1) {
      prevMonth = '0' + prevMonth
    }
    var currentYearMonth = currentYear + currentMonth
    var prevYearMonth = prevYear + prevMonth
    that.setData({
      yearMonth: currentYearMonth
    })
    var userDate = that.data.days
    var yearMonth = prevYearMonth
    //保存上月信息
    that.addTourLeisureDate(yearMonth, userDate, currentYearMonth)

  },
  /**
   * 重置按钮
   */
  restSet() {
    var that = this
    //删除时间
    that.setData({
      dayStyle: [],
      days: []
    })
    var currentYearMonth = that.data.yearMonth
    var userDate = that.data.days
    var yearMonth = currentYearMonth
    //保存当月信息
    that.addTourLeisureDate(yearMonth, userDate, currentYearMonth)

  },
  /**
   * 保存当月信息按钮
   * @yearMonth 年月字符串
   * @userDate 日期数组
   * @currentYearMonth 当前日历所在的年月字符串
   * @issave 提交按钮
   */
  saveTime() {
    var that = this
    var currentYearMonth = that.data.yearMonth
    var userDate = that.data.days
    var yearMonth = currentYearMonth
    var issave = 1
    //保存上月信息
    that.addTourLeisureDate(yearMonth, userDate, currentYearMonth, issave)


  },
/**
 * 用户详情弹窗
 */
  toggleDialog(e) {
    console.log(e.currentTarget.dataset.item.name)
    this.setData({
      showDialog: true,
      item: e.currentTarget.dataset.item
    });
  },
  closeWin() {
    this.setData({
      showDialog: false,
    });
  },
  //语言下拉
  bindLangPickerChange: function (e) {
    console.log('语言发送选择改变，携带值为' + e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  //路线下拉
  bindmettersPickerChange: function (e) {

    console.log('路线发送选择改变，携带值为' + e.detail.value)
    this.setData({
      j: e.detail.value
    })
  },
  //等级下拉
  bindlvPickerChange: function (e) {
    console.log('等级发送选择改变，携带值为' + e.detail.value)
    this.setData({
      k: e.detail.value
    })
  },
  //从业时间下拉
  bindlongTimePickerChange: function (e) {
    console.log('从业时间发送选择改变，携带值为' + e.detail.value)
    this.setData({
      l: e.detail.value
    })
  },

  updateLeisureState: function (e) {
    var that = this


    // console.log('ss:'+that.data.lang[that.data.index])
    var obj = {
      lang: that.data.lang[that.data.index],
      metters: that.data.metters[that.data.j],
      lv: that.data.lv[that.data.k],
      longTime: that.data.longTime[that.data.l],

    }
    wx.request({
      url: app.globalData.url + '/leisure/ceshi',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: {
        userWxId: app.globalData.userWxId,
        data: JSON.stringify(obj)
      },
      success: function (res) {
        console.log(res)

      }
    })
  },

  isShowState() {
    var that = this
    that.setData({
      isShowState:!that.data.isShowState
    })
  }
,

  // 初始化
  initData() {
    let page = this;
    // 获取数据 -> 从后端(暂时放入初始化数据data)
    page.setData({
      callGetPhone: page.data.callGetPhone,
    });
  },

  // 拨打电话给收件人
  callGetPhone(e) {
    // 号码
    let telPhone = e.currentTarget.dataset.getphone;
    this.callPhone(telPhone);
  },

  /**
  * 拨打电话 - 可简单封装工具集
   */
  callPhone(phoneNumber) {
    wx.makePhoneCall({
      phoneNumber: phoneNumber,
      success: function () {
        console.log("拨打电话成功！")

      },
      fail: function () {
        console.log("拨打电话失败！")

      }
    })
  },

  /**
     * 控制显隐
     */
  isShow() {
    var that = this
    that.setData({
      isShow: !that.data.isShow
    })
  },
  /**
   * 开始日期选择
   */
  bindDateStartChange(e) {
    this.setData({
      dateStart: e.detail.value
    })
  },
  /**
   * 结束日期选择
   */
  bindDateEndChange(e) {
    this.setData({
      dateEnd: e.detail.value
    })
  },
  /**
   * 路线选择
   */
  bindmettersPickerChange(e) {
    this.setData({
      mettersIndex: e.detail.value
    })
  },
  /**
   * 选择等级
   */
  bindlvPickerChange(e) {
    this.setData({
      lvIndex: e.detail.value
    })
  },
  /**
   *  获取用户输入字符
   */
  userNameInput: function (e) {
    var that = this
    that.setData({
      searchText: e.detail.value
    })
  },
  /**
   * 点击确认数据库查询
   */
  query() {
    var that = this
    that.setData({
      isShow: false
    })
    var name = that.data.searchText
    var starDate = that.data.dateStart
    var endDate = that.data.dateEnd
    var metters = that.data.metters[that.data.mettersIndex]
    var lv = that.data.lv[that.data.lvIndex]

    console.log('姓名：' + name)
    console.log('开始日期：' + starDate)
    console.log('结束日期：' + endDate)
    console.log('路线：' + metters)
    console.log('等级：' + lv)
  },
  /**
   *  根据姓名模糊查找导游
   */
  queryListForName() {
    var that = this
    wx.showLoading({
      mask: true
    })
    wx.request({
      url: app.globalData.url + '/leisure/queryLeisure',
      data: {
        userWxId: app.globalData.userWxId,
        startDate: this.data.dateStart,
        endDate: this.data.dateEnd
      },
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          items: res.data
        })
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
    console.log('类型：'+app.globalData.userType)
    
    that.initData();
    // 调用函数时，传入new Date()参数，返回值是日期和时间
    var time = util.formatTime(new Date());
    var month = (new Date().getMonth() + 1) + ''
    var year = new Date().getFullYear()
    if (month.length == 1) {
      month = '0' + month
    }
    var yearMonth = year + '' + month
    // 再通过setData更改Page()里面的data，动态更新页面的数据
    that.setData({
      dateStart: time,
      dateEnd: time,
      dateSt: time,
      userType: app.globalData.userType,
      yearMonth: yearMonth
    });
    that.queryTourLeisureDate(yearMonth)
    // this.query();
  },
  
  /**
   * 保存非空闲时间
   * @String userWxId,
   * @String yearMonth,
   * @String useDate
   */
  addTourLeisureDate(yearMonth, useDate, currentYearMonth, issave) {
    var that = this
    wx.request({
      url: app.globalData.url + '/leisure/addTourLeisureDate',
      data: {
        userWxId: app.globalData.userWxId,
        yearMonth: yearMonth,
        useDate: useDate
      },
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (issave == 1) {
          wx.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 2000
          })
        }
        //保存成功之后查询最新数据
        that.queryTourLeisureDate(currentYearMonth)
      }
    })
  },

  /**
   * 查询当前月空闲时间
   * @String userWxId,
   * @String yearMonth
   */
  queryTourLeisureDate(yearMonth) {
    var that = this
    that.setData({
      dayStyle: [],
      days: []
    })
    wx.request({
      url: app.globalData.url + '/leisure/queryTourLeisureDate',
      data: {
        userWxId: app.globalData.userWxId,
        yearMonth: yearMonth
      },
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var days = res.data.tour_use_dates + ''
        var dayStyle = []

        var dayArr = days.split(',');
        if (dayArr.length == 1 && dayArr[0] == '' || dayArr[0] == "undefined") {
          console.log('当前月无信息')
        } else {
          for (var i = 0; i < dayArr.length; i++) {
            var obj = {
              month: 'current',
              day: dayArr[i],
              color: 'white',
              background: 'red'
            }
            dayStyle.push(obj)
          }

          that.setData({
            dayStyle: dayStyle,
            days: dayArr
          })

        }


      },
      fail: function (res) {
        console.log("--------fail--------");
      }
    })
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