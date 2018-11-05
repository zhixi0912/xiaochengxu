//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null
  },
  toastShow: function (that, str, icon) {
    that.setData({
      isShow: true,
      txt: str,
      iconClass: icon
    });
    setTimeout(function () {
      that.setData({
        isShow: false
      });
    }, 1500);
  }, 
  globalData: { //全局变量
    edition:'1.v4', //小程序版本号
    tel:'18816537352', //客服电话
    qq: '88888888', //客服QQ
    wx: '88888888', //客服微信
    website: 'www.kingxiyun.com', //公司网址
    corporateName: '南京金洗云有限公司', //公司名称
    applicationMark: '1', //应用标识 1 金洗云
    cashPayWayId: 2, //现金支付方式ID,1 原生支付宝 2 微信小程序
    appid: '1100310173560359', //appid
    wxappid:'wx8542894abfd18772',
    version: '1.0',//版本号
    sign: '',//签名
    mapType:2,  //地图经纬度类型 1：百度 2：腾讯，默认1
    rang: 10000, //查询附近站点的范围【单位米】
    validateWay: 1, //验证码接口：验证方式 1:短信
    validateType: 2,  ///验证码接口：功能类型 1注册 2 登录
    appkey: 'f7205fffe445408a848eae6fde6d4acf',  //加密所需的key值 
    paykey:'c7543584e1a0409f95b2c855656e7452', //微信支付key值
    loginChannel: '1003',//登录渠道:1001 ios手机 1002 android手机 1003 微信小程序 1004 手机H5
    loginDevice: 'W',//ios手机前缀“I” android手机前缀“A”微信小程序前缀“W” 手机H5前缀“C”
    url: 'https://api.kingxiyun.com/xiaoyou'
  }
})