// pages/workHave/workHave.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    phoneNumber:'', //客服电话
    shopName: '小友洗衣', //商户名称
    systemOrderNo:'', //系统订单号
    status: '订单状态', //订单状态
    animationData: {}, //洗衣图标转动动画
    deviceCode:''//洗衣机编号 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    this.setData({
      systemOrderNo: options.systemOrderNo,  //加载页面时候获取跳转链接中带过来的系统订单编号
      deviceCode: options.deviceCode,
      phoneNumber: getApp().globalData.tel,
    });
    // console.log(that.data.systemOrderNo)

    that.rotate();

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
    var animation = wx.createAnimation({
      duration: 2000,
      timingFunction: 'linear',
    })
    this.animation = animation
    this.setData({
      animationData: animation.export()
    })
    var n = 0;
    var m = true;
    //连续动画需要添加定时器,所传参数每次+1就行
    setInterval(function () {
      n = n + 1;
      // console.log(n);
      if (m) {
        this.animation.rotate(360 * (n)).scale(1, 1).step()
        m = !m;
      } else {
        this.animation.rotate(360 * (n)).scale(1, 1).step()
        m = !m;
      }

      this.setData({
        animationData: this.animation.export()
      })
    }.bind(this), 2000)

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
  showTopTipsRepair: function (e) {
    wx.redirectTo({
      url: '../../pages/equipmentRepair/equipmentRepair',
    })
  },
  customerService:function(){
    var phoneNumber = this.data.phoneNumber;
    wx.makePhoneCall({
      phoneNumber: phoneNumber,
      success: function () {
        console.log("成功拨打电话")
      }
    })
  },
 
  rotate: function (n) {
    
    // console.log(this.animation);
    // this.animation.rotate(150).step().scale(2).step().translate(10).step().skew(10).step().opacity(0.5).width(10).step({ ducation: 8000 })
    this.setData({
      //输出动画
      animation: 150
    })
  },
})