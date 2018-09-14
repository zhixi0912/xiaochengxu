// pages/workingMode/workingMode.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    radioItems: [
      { name: '标准洗', time:'30分钟',text: '30分钟', price:'￥5', value: '0', checked: true},
      { name: '单脱洗', time: '30分钟', text: '30分钟', price: '￥5', value: '1' },
      { name: '快洗', time: '30分钟',text: '30分钟', price: '￥5',value: '2' },
      { name: '深层洗', time: '30分钟',text: '30分钟', price: '￥5', value: '3' },
    ]
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
  
  }
  , showTopTips: function (e) {
    wx.redirectTo({
      url: '../../pages/workHave/workHave',
    })
  }, radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);

    var radioItems = this.data.radioItems;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].value == e.detail.value;
    }

    this.setData({
      radioItems: radioItems
    });
  }
})