// pages/setUp/setUp.js
var app = getApp()
var utils = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      //icon: base64.icon20
    });
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
  showTopTips:function(){  //退出登录

    
    var appid = getApp().globalData.appid; //appid
    var timestamp = Date.parse(new Date());//获取当前时间戳 
    timestamp = timestamp / 1000;
    var version = getApp().globalData.version; //版本号
    var sign = getApp().globalData.sign; //签名
    var usenc = wx.getStorageSync('userIdEnc'); //获取本地缓存中的userIdEnc //用户唯一识别码
    var userIdEnc = wx.getStorageSync('userIdEnc'); //获取本地缓存中的userIdEnc //用户唯一识别码
    var devimark = wx.getStorageSync('loginDevice');//获取本地缓存中的loginDevice
    var url = getApp().globalData.url; //接口路径
    var data = {"appId":appid,"timestamp": timestamp,"version": version,"userIdEnc":userIdEnc};
    var key = getApp().globalData.appkey;  //加密k值 
    var encryption = utils.encryption(key, data) //算出签名
    sign = encryption;//赋值给签名
    data.sign = sign;
    data = JSON.stringify(data);
    // console.log('算出签名的data结果：', data)
    var header = {
      'content-type': 'application/json',
      'cookie': "devimark=" + devimark + ";" + "usenc=" + usenc,
    };
    wx.request({
      method: "post",
      url: url+'/user/baseInfo/userLoginOut', //仅为示例，并非真实的接口地址
      data: data + '@#@' + appid,
      dataType: "json",
      header: header,
      success: function (res) {
        console.log('退出成功！');
        wx.removeStorageSync('userIdEnc', userIdEnc);//将userIdEnc从本地缓存清除
        wx.removeStorageSync('loginDevice', devimark);//将loginDevice从本地缓存清除
        wx.reLaunch({
          url: '../../pages/logs/logs',
        })
      }
    })


    
  }
})