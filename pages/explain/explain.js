// pages/explain/explain.js
var app = getApp()
var utils = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData: [
      { "code": "单脱洗", "text": "6分钟", "type": "1元" },
      { "code": "快洗", "text": "15分钟", "type": "3元" },
      { "code": "标准洗", "text": "20分钟", "type": "4元" },
      { "code": "深层洗", "text": "35分钟", "type": "5元" }
    ]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // var deviceCode = wx.getStorageSync('deviceCode'); //获取本地缓存中的userIdEnc
    // console.log(deviceCode);
    return;


          var appid = getApp().globalData.appid; //appid
          var timestamp = Date.parse(new Date());//获取当前时间戳 
          timestamp = timestamp / 1000;
          var version = getApp().globalData.version; //版本号
          var sign = getApp().globalData.sign; //签名
          var url = getApp().globalData.url; //接口路径
          var data = {"appId": appid,"timestamp":timestamp,"version": version, "deviceCode":deviceCode};
          var key = getApp().globalData.appkey;  //加密k值 
          var encryption = utils.encryption(key, data) //算出签名
          sign = encryption;//赋值给签名
          data.sign = sign;
          data = JSON.stringify(data);
          console.log('算出签名的data结果：', data)
          wx.request({ //请求洗衣模式列表
            method: "post",
            url: url+'/device/washing/queryWorkModeAndPriceList',
            data: data + '@#@' + appid,
            header: {
              'content-type': 'application/json'
            },
            dataType: "json",
            success: function (res) {
              // res.data.data = { "deviceId": 2, "workModeAndPriceList": [{ "modeId": 1, "modeName": "加强洗", "modeTime": 30, "platformPrice": 500 }, { "modeId": 2, "modeName": "标准洗", "modeTime": 20, "platformPrice": 400 }, { "modeId": 3, "modeName": "快速洗", "modeTime": 5, "platformPrice": 300 }, { "modeId": 4, "modeName": "单脱水", "modeTime": 2, "platformPrice": 100 }] }
              var status = res.data.code;
              if (status == '0000') {
                //that.errorShow('扫码成功');

                var workModeAndPriceList = res.data.data.workModeAndPriceList;
                var deviceId = res.data.data.deviceId

                // console.log("//////////",deviceCode);
                // console.log(res);
                wx.navigateTo({ url: '../workingMode/workingMode?workModeAndPriceList=' + JSON.stringify(workModeAndPriceList) + '&deviceId=' + deviceId + '&deviceCode=' + deviceCode });

              } else if (status == '2007') { //设备不存在
                that.errorShow('设备不存在');
              } else if (status == '2017') { //洗衣机已被使用
                that.errorShow('洗衣机已被使用');
              } else if (status == '2018') { //洗衣机盖没关
                that.errorShow('洗衣机盖没关');
              } else if (status == '2019') { //洗衣机故障
                that.errorShow('洗衣机故障');





              } else if (status == '2020') { //洗衣机消毒中
                that.errorShow('洗衣机消毒中');
              } else {  //设备异常
                that.errorShow('设备异常');
              }

            }, fail: function (res) {
              console.log("请求洗衣模式列表失败", res)
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
  imageLoad: function (e) { //设置图片等比缩放
    var imageSize = utils.expImageUtil.expImageUtil(e)
    this.setData({
      imagewidth: imageSize.imageWidth,
      imageheight: imageSize.imageHeight
    })
  },
})