// pages/equipmentRepair/equipmentRepair.js
var app = getApp()
var utils = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    radioItems: [
      { imgSrc: "../../images/equipmentRepair/icon-1.png", describe: "外观损坏", val: "1" },
      { imgSrc: "../../images/equipmentRepair/icon-2.png", describe: "漏水", val: "2" },
      { imgSrc: "../../images/equipmentRepair/icon-3.png", describe: "漏电", val: "3" },
      { imgSrc: "../../images/equipmentRepair/icon-4.png", describe: "噪音太大", val: "4" },
      { imgSrc: "../../images/equipmentRepair/icon-5.png", describe: "无法进水", val: "5" },
      { imgSrc: "../../images/equipmentRepair/icon-6.png", describe: "无法启动", val: "6" },
      { imgSrc: "../../images/equipmentRepair/icon-7.png", describe: "无法脱水", val: "7" },
      { imgSrc: "../../images/equipmentRepair/icon-8.png", describe: "其他", val: "8" }
    ],
    listData: [
      { imgSrc: "../../images/equipmentRepair/icon-1.png"},
      { imgSrc: "../../images/equipmentRepair/icon-2.png" },
      { imgSrc: "../../images/equipmentRepair/icon-3.png"},
      { imgSrc: "../../images/equipmentRepair/icon-4.png"},
      { imgSrc: "../../images/equipmentRepair/icon-5.png" },
      { imgSrc: "../../images/equipmentRepair/icon-6.png"},
      { imgSrc: "../../images/equipmentRepair/icon-7.png"},
      { imgSrc: "../../images/equipmentRepair/icon-8.png"}
    ],
    listDataOn:[
      { imgSrc: "../../images/equipmentRepair/icon-on-1.png" },
      { imgSrc: "../../images/equipmentRepair/icon-on-2.png" },
      { imgSrc: "../../images/equipmentRepair/icon-on-3.png"},
      { imgSrc: "../../images/equipmentRepair/icon-on-4.png"},
      { imgSrc: "../../images/equipmentRepair/icon-on-5.png"},
      { imgSrc: "../../images/equipmentRepair/icon-on-6.png"},
      { imgSrc: "../../images/equipmentRepair/icon-on-7.png"},
      { imgSrc: "../../images/equipmentRepair/icon-on-8.png"}
    ],
    deviceCode:'', //洗衣机编号
    textareaShow:'', //故障描述
    contents: '', //提交故障描述组合 【故障类型文字描述拼上客户输入的故障描述】
    radioItemsId:'', //故障类型默认值 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
  showTopTips:function(){ //扫码
    var that = this;
    wx.scanCode({  //扫码洗衣机编号
      success: (res) => {
        this.setData({
          deviceCode: res.result //将扫码的值赋值给默认值并在页面渲染出来
        });
      },
      fail: (res) => {
        that.errorShow('扫码失败');
        console.log("扫码失败", res);
      }
    })
  },
  deviceCode:function(e){ //洗衣机编号获取
    var that = this;
    // console.log("111",e);
    that.setData({
      deviceCode: e.detail.value,
    })
  },
  showTextarea: function (e) { //故障描述栏获取
    // console.log(e.detail.value);
    var that = this;
    that.setData({
      textareaShow: e.detail.value,
    })
  },
  subEquipment:function(){ //提交故障报修
    var that = this;
    if (that.data.deviceCode == ''){
      that.errorShow("请输入洗衣机编号");
    } else if (that.data.textareaShow == ''){
      that.errorShow("请输入故障描述");
    }else{



    
      var appid = getApp().globalData.appid; //appid
      var timestamp = Date.parse(new Date());//获取当前时间戳 
      timestamp = timestamp / 1000;
      var version = getApp().globalData.version; //版本号
      var sign = getApp().globalData.sign; //签名
      
      var userIdEnc = wx.getStorageSync('userIdEnc'); //获取本地缓存中的userIdEnc //用户唯一识别码
      var contents = that.data.contents + that.data.textareaShow; //故障描述
      var deviceCode = that.data.deviceCode; //设备ID
      var url = getApp().globalData.url; //接口路径
      var data = {"appId": appid ,"timestamp":timestamp,"version": version,"userIdEnc":userIdEnc,"contents": contents,"deviceCode": deviceCode};
      var key = getApp().globalData.appkey;  //加密k值 
      var encryption = utils.encryption(key, data) //算出签名
      sign = encryption;//赋值给签名
      data.sign = sign;
      data = JSON.stringify(data);
          // console.log('算出签名的data结果：', data)

      wx.request({ //请求故障报修成功
        method: "post",
        url: url+'/device/deviceFault/submitFaultInfo',
        data: data + '@#@' + appid,
        header: {
          'content-type': 'application/json'
        },
        dataType: "json",
        success: function (res) {
          var statusPay = res.data.code;

          if (statusPay == '0000') { //故障报修成功
            
            // console.log("故障报修成功", res)
            wx.navigateTo({ url: '../../pages/index/index'});
          } else if (statusPay == '2000') { //2012 失败
            that.errorShow('故障报修失败');
          } else if (statusPay == '2007') { //设备不存在
            that.errorShow('设备不存在');
          } else {  //系统异常
            that.errorShow('系统异常');
          }

        }, fail: function (res) {
          console.log("故障报修", res)
        }
      })
    }
  },
  radioChange: function (e) { //报修故障类型选择事件
    // console.log('radio发生change事件，携带value值为：', e.detail.value);
    // debugger;
    var radioItemsId = e.detail.value;//获取每次点击事件的值
    this.setData({
      radioItemsId: radioItemsId //将点击值赋值给默认值并在页面渲染出来
    });
    
    var SrcRadioItems = this.data.radioItems;
    var contents = this.data.contents; //故障类型选择

    for (var i = 0; i < SrcRadioItems.length; i++) {  //匹配洗衣模式集合中的modeId,
      if (radioItemsId == SrcRadioItems[i].val) {
        this.setData({
          contents: SrcRadioItems[i].describe + '|' //成功后加上‘|’拼接上输入的故障描述
        });

      }
    }


    var imgListOn = this.data.listDataOn; //取出选中状态图标集合
    var imgList = this.data.listData;  //取出包含不选中状态图标集合
    var SrcRadioItems = this.data.radioItems;  //包含选中项图标状态的全部数据循环
    // console.log(imgList);
    for (var i = 0; i < imgList.length; i++) {  //处理点击效果前，先重置其他选中状态
      SrcRadioItems[i].imgSrc = imgList[i].imgSrc
    }
    this.setData({
      radioItems: SrcRadioItems //刷新全部不选中状态列表
    });
    for (var i = 0; i < imgListOn.length; i++) {
      if ((radioItemsId - 1) == i) { //根据点击事件获取当前点击位置匹配选中状态图标集合的图标位置
        SrcRadioItems[i].imgSrc = imgListOn[i].imgSrc //将取出的选中图标存入全部数据中
      }
    }
    this.setData({
      radioItems: SrcRadioItems //刷新选中状态列表
    });

    // console.log("111111/////////////", this.data.contents) 
  },
  errorShow: function (error) { //统一调用错误提醒tips
    wx.showToast({
      title: error,
      icon: 'error',
      image: '../../images/error.png',
      duration: 2000
    })
  }
})