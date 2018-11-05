// pages/detailed/detailed.js
var app = getApp()
var utils = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    amountFlowList:[],
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

    var userIdEnc = wx.getStorageSync('userIdEnc'); //获取本地缓存中的userIdEnc //用户唯一识别码
    var loginDevice = wx.getStorageSync('loginDevice');//获取本地缓存中的loginDevice

    var data = { "appId": appid, "timestamp": timestamp, "version": version, "userIdEnc": userIdEnc, };
    var url = getApp().globalData.url; //接口路径
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
    wx.request({ //请求查询记录接口
      method: "post",
      url: url + '/user/account/amountFlowList',
      data: data + '@#@' + appid,
      header: header,
      dataType: "json",
      success: function (res) {
        // console.log("查询记录成功", res) 
        if (res.data.code == '0000') { //查询记录成功
          var amountFlowList = res.data.data.amountFlowList;
          // console.log(amountFlowList);
          for (var i = 0; i < amountFlowList.length;i++){
            // console.log(amountFlowList[i].date);
            var date = utils.newDataTime(amountFlowList[i].date) 
            amountFlowList[i].date = date;
            // console.log(date);
            if (amountFlowList[i].type==1){
              amountFlowList[i].type = '+'
            } else if (amountFlowList[i].type == 2){
              amountFlowList[i].type = '-'
            }
          }
          // console.log('///',amountFlowList);
          that.setData({
            amountFlowList: amountFlowList //查询记录 
          });

        } else if (res.data.code == '2014') {  //2014 用户没有登录
          that.errorShow('用户没有登录');
          wx.navigateTo({
            url: '../../pages/logs/logs',
          })
        } else {
          that.errorShow('查询记录失败');
          wx.navigateTo({
            url: '../../pages/myWallet/myWallet',//我的钱包页
          })
        }

      }, fail: function (res) {
        console.log("查询记录失败", res)
        that.errorShow('查询记录失败');
        wx.navigateTo({
          url: '../../pages/myWallet/myWallet',//我的钱包页
        })
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
  errorShow: function (error) { //统一调用错误提醒tips
    wx.showToast({
      title: error,
      icon: 'error',
      image: '../../images/error.png',
      duration: 2000
    })
  },
})