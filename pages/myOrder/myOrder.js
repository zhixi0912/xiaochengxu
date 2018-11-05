// pages/myOrder/myOrder.js
var app = getApp()
var utils = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    washingOrderList:'',//订单列表集合
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
    var data = {"appId": appid, "timestamp": timestamp,"version": version, "userIdEnc": userIdEnc};
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
    wx.request({ //请求用户订单列表接口
      method: "post",
      url: url+'/order/washing/queryUserWashingOrderList',
      data: data + '@#@' + appid,
      header: header,
      dataType: "json",
      success: function (res) {
        // console.log("查询成功", res) 
        var statusPay = res.data.code;
        if (statusPay == '0000') { //查询成功
          var washingOrderList = res.data.data.washingOrderList;
          for (var i = 0; i < washingOrderList.length;i++){
            if (washingOrderList[i].orderState == 1){
              washingOrderList[i].orderState = '待付款';
            } else if (washingOrderList[i].orderState == 2){
              washingOrderList[i].orderState = '已付款';
            } else if (washingOrderList[i].orderState == 3) {
              washingOrderList[i].orderState = '已取消';
            } else if (washingOrderList[i].orderState == 4) {
              washingOrderList[i].orderState = '已退款';
            } else if (washingOrderList[i].orderState == 5) {
              washingOrderList[i].orderState = '已完成';
            }
           
            var date = new Date(washingOrderList[i].createDate);
            var y = date.getFullYear();
            var m = date.getMonth() + 1;
            m = m < 10 ? ('0' + m) : m;
            var d = date.getDate();
            d = d < 10 ? ('0' + d) : d;
            var h = date.getHours();
            h = h < 10 ? ('0' + h) : h;
            var minute = date.getMinutes();
            var second = date.getSeconds();
            minute = minute < 10 ? ('0' + minute) : minute;
            second = second < 10 ? ('0' + second) : second;
            washingOrderList[i].createDate = y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second; 
          }
          that.setData({
            washingOrderList: res.data.data.washingOrderList,
          })
          // console.log("查询成功", that.data.washingOrderList) 

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
        console.log("查询失败", res)
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
  showTopTips:function(e){ //点击订单列表判断 是否为正在进行中的订单
    // console.log(e.currentTarget.dataset.orderstate)
    var systemOrderNo = e.currentTarget.dataset.systemorderno; //订单编号 
    var deviceCode = e.currentTarget.dataset.devicecode;  //洗衣机编号
    // console.log(deviceCode);
    // console.log(systemOrderNo);
    if (e.currentTarget.dataset.orderstate =='已付款'){ //跳转正在洗衣页面
      wx.navigateTo({ url: '../../pages/workHave/workHave?systemOrderNo=' + systemOrderNo + '&deviceCode=' + deviceCode, })
    }
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