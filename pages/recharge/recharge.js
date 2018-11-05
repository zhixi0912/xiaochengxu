// pages/recharge/recharge.js
var app = getApp()
var utils = require('../../utils/util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    
    radioItems: [
      { name: '微信充值', value: '0',}
    ],
    priceList:[ //充值金额列表 【单位：分】
      { price:10000},
      { price: 5000 },
      { price: 2000 },
      { price: 1000 },
      { price: 20000 },
    ],
    onPrice:'',//每次点击的价格
    rechargeType:'', //每次点击的充值类型
    systemOrderNo:'',//生成充值订单编号 
    sdkContent: '',//快捷SDK
    accountBalance:'',//帐户余额 [单位分]
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
            // pointsBalance: res.data.data.pointsBalance//积分
          })
        

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
        console.log("支付失败", res)
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
  
  }, radioChange: function (e) {//选择充值金额
    // console.log('radio发生change事件，携带value值为：', e.detail.value);

    var onPrice = e.detail.value;

    this.setData({
      onPrice: onPrice
    });
  },
  radioChangeType:function(e){  //选择充值类型 【如微信支付】
    // console.log('radio发生change事件，携带value值为：', e.detail.value);
    var rechargeType = e.detail.value;
    this.setData({
      rechargeType: rechargeType
    });
  },
  subRecharge: function (e) { //充值下单
    var that = this
    var amount = Number(that.data.onPrice); //金额 [单位：分]
    if (amount==''){
      that.errorShow('请选择充值金额');
      return;
    }
    var appid = getApp().globalData.appid; //appid
    var timestamp = Date.parse(new Date());//获取当前时间戳 
    timestamp = timestamp / 1000;
    var version = getApp().globalData.version; //版本号
    var sign = getApp().globalData.sign; //签名

    var userIdEnc = wx.getStorageSync('userIdEnc'); //获取本地缓存中的userIdEnc //用户唯一识别码
    var loginDevice = wx.getStorageSync('loginDevice');//获取本地缓存中的loginDevice
    
    var data = { "appId": appid, "timestamp": timestamp, "version": version, "userIdEnc": userIdEnc, "amount": amount };
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
    wx.request({ //请求用充值下单接口
      method: "post",
      url: url + '/order/recharge/createAmountOrder',
      data: data + '@#@' + appid,
      header: header,
      dataType: "json",
      success: function (res) {
        // console.log("充值成功", res) 
        if (res.data.code == '0000') { //下单成功
          that.setData({
            systemOrderNo: res.data.data.systemOrderNo //返回充值订单编号 
          });
          that.cashPay(); //调用支付方法
       
        } else if (res.data.code == '2014'){  //2014 用户没有登录
          wx.navigateTo({
            url: '../../pages/logs/logs',
          })
        }else{
          wx.navigateTo({
            url: '../../pages/rechargeFailure/rechargeFailure',//充值失败页
          })
        }

      }, fail: function (res) {
        console.log("充值失败", res)
        wx.navigateTo({
          url: '../../pages/rechargeFailure/rechargeFailure',//充值失败页
        })
      }
    })

  },
  cashPay: function(){ // 现金充值
    var that = this
    // var amount = Number(that.data.onPrice); //金额
    var systemOrderNo = that.data.systemOrderNo;//充值订单号
    var cashPayWayId = getApp().globalData.cashPayWayId; //现金支付方式ID
    var appid = getApp().globalData.appid; //appid
    var timestamp = Date.parse(new Date());//获取当前时间戳 
    timestamp = timestamp / 1000;
    var version = getApp().globalData.version; //版本号
    var sign = getApp().globalData.sign; //签名
    var userIdEnc = wx.getStorageSync('userIdEnc'); //获取本地缓存中的userIdEnc //用户唯一识别码
    var loginDevice = wx.getStorageSync('loginDevice');//获取本地缓存中的loginDevice
    var data = { "appId": appid, "timestamp": timestamp, "version": version, "systemOrderNo": systemOrderNo, "cashPayWayId": cashPayWayId };
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
    wx.request({ //请求用现金支付接口
      method: "post",
      url: url + '/pay/cash/cashPay',
      data: data + '@#@' + appid,
      header: header,
      dataType: "json",
      success: function (res) {
        // console.log("现金支付成功", res)
        if (res.data.code == '0000') { //现金支付成功
          var sdkContent = 'prepay_id='+res.data.data.sdkContent;
         
          var wxappid = getApp().globalData.wxappid; //appid
          var timestamp = Date.parse(new Date());//获取当前时间戳 
          timestamp = timestamp / 1000;
          timestamp = timestamp.toString();
          var nonceStr = utils.getNum(); //随机串
          var signType = 'MD5';
          var paykey = getApp().globalData.paykey;
         
          var paySign = { "appId": wxappid, "nonceStr": nonceStr, "package": sdkContent, "signType": signType, "timeStamp": timestamp,}
          var objKeySort = utils.objKeySort(paySign); //排序
          paySign = utils.splicingString(objKeySort); //按微信支付验签规则拼接字符串
          paySign = paySign + "&key=" + paykey;
          console.log("sort_ASCII", objKeySort);
          console.log("paySign", paySign);
          var md5 = require('../../utils/js/md5.js');  //md5加密
          var md5Pw = md5.hexMD5(paySign);
          paySign = md5Pw.toUpperCase(); //按微信支付验签规则将签名字母转大写
          console.log(paySign);
          console.log(timestamp, nonceStr, sdkContent, paySign);
          wx.requestPayment(
            {
              'timeStamp': timestamp,
              'nonceStr': nonceStr,
              'package': sdkContent,
              'signType': 'MD5',
              'paySign': paySign,
              'success': function (res) { 
                // console.log(1);
                 wx.navigateTo({
                    url: '../../pages/rechargeSuccess/rechargeSuccess',//充值成功页
                  })
              },
              'fail': function (res) {
                wx.navigateTo({
                  url: '../../pages/rechargeFailure/rechargeFailure',//充值失败页
                })
               },
              'complete': function (res) {
                wx.navigateTo({
                  url: '../../pages/rechargeFailure/rechargeFailure',//充值失败页
                })
              }
            })


          // console.log("0000", res.data.data.systemOrderNo)
         
        } else if (res.data.code == '2014') {  //2014 用户没有登录
          wx.navigateTo({
            url: '../../pages/logs/logs',
          })
        } else {
          wx.navigateTo({
            url: '../../pages/rechargeFailure/rechargeFailure',//充值失败页
          })
        }

      }, fail: function (res) {
        console.log("充值失败", res)
        wx.navigateTo({
          url: '../../pages/rechargeFailure/rechargeFailure',//充值失败页
        })
      }
    })
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