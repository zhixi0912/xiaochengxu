// pages/workingMode/workingMode.js
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
    default: 2,  //默认选中modeId值 
    orderAmount:400 //价格
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      radioItems: JSON.parse(options.workModeAndPriceList)
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
  
  }
  , showTopTips: function (e) {
    var appid = '1100310183560349'; //appid wxf79825c96701f981
    var timestamp = Date.parse(new Date());//获取当前时间戳 
    timestamp = timestamp / 1000;
    var version = '1.0'; //版本号
    var sign = 'erwlkrjlkwjelrjwlke'; //签名
    // var deviceCode = 'D100000002'; 
    var orderAmount = this.data.orderAmount; //订单金额
    
    var modeId = this.data.default; //洗衣模式ID
    var deviceId = ''; //设备ID
    var userIdEnc = ''; //用户唯一识别码
    wx.request({ //获取当前定位经续度作为条件传入后台查询当前附近10公里范围内机站坐标列表
      method: "post",
      url: 'http://uat.kingxiyun.com/xiaoyou/order/washing/createWashingOrder',
      data: '{"appId": "' + appid + '", "timestamp": ' + timestamp + ', "version": "' + version + '", "sign": "' + sign + '", "orderAmount": "' + orderAmount + '","modeId": "' + modeId + '","deviceId": "' + deviceId + '","userIdEnc": "' + userIdEnc + '", }@#@1100310183560349',
      header: {
        'content-type': 'application/json'
      },
      dataType: "json",
      success: function (res) {

        var status = res.data.code;
        if (status == '0000') {  //下单成功
          that.errorShow('下单成功');

          // var workModeAndPriceList = res.data.data.workModeAndPriceList;
          // var result = JSON.stringify(workModeAndPriceList);
          // console.log(workModeAndPriceList);
          // console.log(result);
          // wx.navigateTo({ url: '../workingMode/workingMode?workModeAndPriceList=' + JSON.stringify(workModeAndPriceList) });

        } else if (status == '2016') { //余额不足
          that.errorShow('设备不存在');
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
        console.log("请求失败", res)
      }
    })

    // wx.redirectTo({
    //   url: '../../pages/workHave/workHave',
    // })
  }, 
  radioChange: function (e) { //洗衣模式选择事件
    console.log('radio发生change事件，携带value值为：', e.detail.value);
   
    var radioItems = e.detail.value;//获取每次点击事件的值
    this.setData({
      default: radioItems //将点击值赋值给默认值并在页面渲染出来
    });

    var radioList = this.data.radioItems;
    
    for (var i = 0; i < radioList.length; i++) {  //匹配洗衣模式集合中的modeId,
      if (radioItems == radioList[i].modeId){
        this.setData({
          orderAmount: radioList[i].platformPrice //成功后取出价格存为全局data
        });
      
      }
    }
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