var app = getApp()
var utils = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    radioItems: [
       // {modeId:1, modeName: '加强洗', time:'30分钟',modeTime: 30, platformPrice:500},
      // {modeId:2, modeName: '标准洗', time: '30分钟', modeTime: 30, platformPrice: 400},
      // {modeId:3, modeName: '快速洗', time: '30分钟',modeTime: 30, platformPrice: 300},
      // {modeId:4, modeName: '单脱水', time: '30分钟',modeTime: 30, platformPrice: 100},
    ],
    imgList: [ //不选中时洗衣模式图标集合
      { imgSrc:'../../images/workingMode/pattern-1.png'},
      { imgSrc:'../../images/workingMode/pattern-2.png' },
      { imgSrc:'../../images/workingMode/pattern-3.png' },
      { imgSrc:'../../images/workingMode/pattern-4.png' },
    ], 
    imgListOn: [ //选中时洗衣模式图标集合
      { imgSrc: '../../images/workingMode/pattern-on-1.png' },
      { imgSrc: '../../images/workingMode/pattern-on-2.png' },
      { imgSrc: '../../images/workingMode/pattern-on-3.png' },
      { imgSrc: '../../images/workingMode/pattern-on-4.png' },
    ],
    defaultNum: 2,  //默认选中modeId值 
    orderAmount:400, //价格
    deviceId: '', //设备id
    deviceCode:'',//洗衣机编号
    imagewidth: 0,//缩放后的宽
    imageheight: 0,//缩放后的高
    onShow:'',
    repeatClick:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    var SrcRadioItems = JSON.parse(options.workModeAndPriceList);
    var SrcImgList = this.data.imgList;  //取出所有没选中图标集合
    var imgListOn = this.data.imgListOn; //取出所有选中图标集合
    var deviceCode = options.deviceCode; //洗衣机编号
    var defaultNum = this.data.defaultNum ; //取出默认选中项
    for (var i = 0; i < SrcImgList.length; i++) {//将没选中图标集合循环放入订单列表中一起初始化
        SrcRadioItems[i].imgSrc = SrcImgList[i].imgSrc
      }
    for (var i = 0; i < imgListOn.length; i++) { //将默认值与选中图标集合下标匹配，取出该条选中图片重置订单列表中该条一起初始化
      if ((defaultNum-1)==i){
        SrcRadioItems[i].imgSrc = imgListOn[i].imgSrc
      }
    }
    
    // console.log(defaultNum, SrcRadioItems[1].modeId);
    this.setData({ //取到跳转链接中的订单列表后在页面初始化
      radioItems: SrcRadioItems,
      deviceId: options.deviceId,
      deviceCode: deviceCode
    });
    // console.log("------000",this.data.radioItems);
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
  , showTopTips: function (e) {
    var formId = e;
    var that = this
    var appid = getApp().globalData.appid; //appid
    var timestamp = Date.parse(new Date());//获取当前时间戳 
    timestamp = timestamp / 1000;
    var version = getApp().globalData.version; //版本号
    var sign = getApp().globalData.sign; //签名
    // var deviceCode = 'D100000002'; 
    var orderAmount = this.data.orderAmount; //订单金额
    var modeId = Number(this.data.defaultNum); //洗衣模式ID
    var userIdEnc = wx.getStorageSync('userIdEnc'); //获取本地缓存中的userIdEnc //用户唯一识别码
    var loginDevice = wx.getStorageSync('loginDevice');//获取本地缓存中的loginDevice
    var deviceId = Number(this.data.deviceId); //设备ID
    
    var header = {
      'content-type': 'application/json',
      'cookie': "devimark=" + loginDevice + ";" + "usenc=" + userIdEnc,
    };
  
    var repeatClick = that.data.repeatClick;
    if (repeatClick==1){
      return;
    }
    that.setData({
      repeatClick: 1 //点击后改变状态防止多次点击
    })
    var url = getApp().globalData.url; //接口路径
    var createWashingOrderData = {"appId":appid,"timestamp":timestamp, "version":version,"orderAmount": orderAmount ,"modeId": modeId ,"deviceId":deviceId,"userIdEnc":userIdEnc};
    // console.log('data结果：', createWashingOrderData)
    var key = getApp().globalData.appkey;  //加密k值 
    var encryption = utils.encryption(key, createWashingOrderData) //算出签名
    sign = encryption;//赋值给签名
    createWashingOrderData.sign = sign;
    createWashingOrderData = JSON.stringify(createWashingOrderData);
    // console.log('算出签名的data结果：', createWashingOrderData)

    wx.request({ //请求下单接口
      method: "post",
      url: url+'/order/washing/createWashingOrder',
      data: createWashingOrderData + '@#@' + appid,

      header: header,
      dataType: "json",
      success: function (res) {
        
        var status = res.data.code;
        if (status == '0000') {  //下单列表请求成功
          //that.errorShow('下单列表请求成功');
          // console.log("////下单列表请求成功////",res);
          var systemOrderNo = res.data.data.systemOrderNo; //系统订单编号
          var amountPayData = {"appId": appid, "timestamp": timestamp, "version": version , "systemOrderNo":  systemOrderNo};
          var url = getApp().globalData.url; //接口路径
          var key = getApp().globalData.appkey;  //加密k值 
          var encryption2 = utils.encryption(key, amountPayData) //算出签名
          var sign2 = encryption2;//赋值给签名
          amountPayData.sign = sign2;
          amountPayData = JSON.stringify(amountPayData);
          // console.log('算出签名的data结果：', amountPayData)
          wx.request({ //请求支付接口【余额支付】
            method: "post",
            url: url +'/pay/amount/amountPay',
            data: amountPayData + '@#@' + appid,
            header: header,
            dataType: "json",
            success: function (res) {
              var statusPay = res.data.code;
             
              if (statusPay == '0000') { //支付成功
                // systemOrderNo;//系统订单编号
                var deviceCode = that.data.deviceCode;
                // console.log("支付成功", res, 'formId',formId)
                wx.navigateTo({ url: '../../pages/workHave/workHave?systemOrderNo=' + systemOrderNo + '&deviceCode=' + deviceCode});
                that.setData({
                  repeatClick: 0 //订单完成生重置点击状态
                })

                var applicationMark = Number(getApp().globalData.applicationMark); //应用标识 1 金洗云
                var paramId = formId;  //微信小程序formid等
                var url = getApp().globalData.url; //接口路径
                var saveClientPushConfigInfoData = {"appId": appid, "timestamp":  timestamp , "version": version,  "loginDevice":  loginDevice , "applicationMark": applicationMark , "paramId": paramId };
                var key = getApp().globalData.appkey;  //加密k值 
                var encryption3 = utils.encryption(key, saveClientPushConfigInfoData) //算出签名
                var sign3 = encryption3;//赋值给签名
                saveClientPushConfigInfoData.sign = sign3;
                saveClientPushConfigInfoData = JSON.stringify(saveClientPushConfigInfoData);
                // console.log('算出签名的调用后台消息data结果：', amountPayData)
                wx.request({ //调用后台消息推送接口
                  method: "post",
                  url: url +'/device/clientpush/saveClientPushConfigInfo',
                  data: saveClientPushConfigInfoData + '@#@' + appid,
                  header: {
                    'content-type': 'application/json'
                  },
                  dataType: "json",
                  success: function (res) {
                    console.log("调用后台消息推送接口成功", res)
                  }, fail: function (res) {
                    console.log("调用后台消息推送接口失败", res)
                  }
                })





              } else if (statusPay == '2013' && statusPay == '2013') { //2012 非有效用户 2013 账户有问题
                that.errorShow('帐户异常');
              } else if (statusPay == '2014') { //用户没有登录
                that.errorShow('用户没有登录');
              } else if (statusPay == '2016') { //余额不足
                that.errorShow('余额不足');
              } else if (statusPay == '2017') { //洗衣机已被使用
                that.errorShow('洗衣机已被使用');
              } else if (statusPay == '2018') { //洗衣机盖没关
                that.errorShow('洗衣机盖没关');
              } else if (statusPay == '2019') { //2019 洗衣机故障
                that.errorShow('洗衣机故障');
              } else if (statusPay == '2020') { //洗衣机消毒中
                that.errorShow('洗衣机消毒中');
              }else {  //系统异常
                that.errorShow('系统异常'); 
              }

            }, fail: function (res) {
              console.log("支付失败", res)
            }
          })

          

        } else if (status == '2016') { //余额不足
          that.errorShow('余额不足');
        } else if (status == '2017') { //洗衣机已被使用
          that.errorShow('洗衣机已被使用');
        } else if (status == '2018') { //洗衣机盖没关
          that.errorShow('洗衣机盖没关');
        } else if (status == '2019') { //洗衣机故障
          that.errorShow('洗衣机故障');
        } else if (status == '2020') { //洗衣机消毒中
          that.errorShow('洗衣机消毒中');
        } else if (status == '2021') { //价格已变动
          that.errorShow('价格已变动');
        } else if (status == '2022') { //有进行中的订单
          that.errorShow('有进行中的订单');
        } else {  //系统异常
          that.errorShow('系统异常');
        }

      }, fail: function (res) {
        console.log("下单列表请求失败", res)
      }
    })

  }, 
  radioChange: function (e) { //洗衣模式选择事件
    // console.log('radio发生change事件，携带value值为：', e.detail.value);
   
    var radioItems = e.detail.value;//获取每次点击事件的值
    this.setData({
      defaultNum: radioItems //将点击值赋值给默认值并填在单项按钮值上
    });


    var radioList = this.data.radioItems;
    
    for (var i = 0; i < radioList.length; i++) {  //匹配洗衣模式集合中的modeId,
      if (radioItems == radioList[i].modeId){
        this.setData({
          orderAmount: radioList[i].platformPrice //成功后取出价格存为全局data
        });
      
      }
    }
    var imgListOn = this.data.imgListOn; //取出选中状态图标集合
    var imgList = this.data.imgList;  //取出包含不选中状态图标集合
    var SrcRadioItems = this.data.radioItems;  //包含选中项图标状态的全部数据循环
    
    for (var i = 0; i < imgList.length; i++) {  //处理点击效果前，先重置其他选中状态
      SrcRadioItems[i].imgSrc = imgList[i].imgSrc
    }
    this.setData({
      radioItems: SrcRadioItems //刷新全部不选中状态列表
    });
    for (var i = 0; i < imgListOn.length; i++){
      if ((radioItems - 1) == i) { //根据点击事件获取当前点击位置匹配选中状态图标集合的图标位置
          SrcRadioItems[i].imgSrc = imgListOn[i].imgSrc //将取出的选中图标存入全部数据中
        }
    }
    this.setData({
      radioItems: SrcRadioItems //刷新选中状态列表
    });
     
  },
  submitInfo:function(e){
    var formId = e.detail.formId;
    this.showTopTips(formId); 
    // console.log('formId////',e.detail.formId);
  },
  errorShow: function (error) { //统一调用错误提醒tips
    wx.showToast({
      title: error,
      icon: 'error',
      image: '../../images/error.png',
      duration: 2000
    })
  },
  imageLoad: function (e) { //设置图片等比缩放
    var imageSize = utils.imageUtil.imageUtil(e)
    this.setData({
      imagewidth: imageSize.imageWidth,
      imageheight: imageSize.imageHeight
    })
  }

})