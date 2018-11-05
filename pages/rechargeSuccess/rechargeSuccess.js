// pages/rechargeSuccess/rechargeSuccess.js
var app = getApp()
var utils = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    accountBalance:'',//余额[单位：分]
    pointsBalance:''//积分
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var appid = getApp().globalData.appid; //appid
    var timestamp = Date.parse(new Date());//获取当前时间戳 
    timestamp = timestamp / 1000;
    var version = getApp().globalData.version; //版本号
    var sign = getApp().globalData.sign; //签名
    var url = getApp().globalData.url; //接口路径
    var userIdEnc = wx.getStorageSync('userIdEnc'); //获取本地缓存中的userIdEnc //用户唯一识别码
    var loginDevice = wx.getStorageSync('loginDevice');//获取本地缓存中的loginDevice
    var data = { "appId": appid, "timestamp": timestamp, "version": version, "userIdEnc": userIdEnc };
    var key = getApp().globalData.appkey;  //加密k值 
    var encryption = utils.encryption(key, data) //算出签名
    sign = encryption;//赋值给签名
    data.sign = sign;
    data = JSON.stringify(data);
    // console.log('算出签名的data结果：', data)
    var header = {
      'content-type': 'application/json',
      'cookie': "devimark=" + loginDevice + ";" + "usenc=" + userIdEnc,
    };
    wx.request({ //请求用户帐户接口，余额、积分
      method: "post",
      url: url + '/user/account/queryAccountAmount',
      data: data + '@#@' + appid,
      header: header,
      dataType: "json",
      success: function (res) {
        var statusPay = res.data.code;
        if (statusPay == '0000') { //查询成功

          that.setData({
            accountBalance: res.data.data.accountBalance,//余额
            pointsBalance: res.data.data.pointsBalance//积分
          })
          // console.log("查询成功", res.data.data.accountBalance) //余额
          // console.log("查询成功", res.data) 

        } else if (statusPay == '2000') { //2000 失败
          that.errorShow('查询失败');
        } else if (statusPay == '2012') { //用户冻结
          that.errorShow('用户冻结');
        } else if (statusPay == '2014') { //用户没有登录
          that.errorShow('用户没有登录');
        } else {  //系统异常
          that.errorShow('系统异常');
        }

      }, fail: function (res) {
        console.log("请求用户帐户接口失败", res)
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
  
  },
  showTopTipsA: function (e) {//返回主页立即洗衣
    wx.navigateTo({
      url: '../../pages/index/index',
    })
  },
  showTopTipsB: function (e) { //继续充值
    wx.navigateTo({
      url: '../../pages/recharge/recharge',
    })
  }
})