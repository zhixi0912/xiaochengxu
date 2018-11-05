//logs.js
const utils = require('../../utils/util.js')
const apps = require('../../app.js')
var app = getApp();

var timer = 1;

// var wechatInfo;  //微信版本号
Page({
  data: {
    sendmsg: "weui-vcode-btn",
    getmsg: "获取短信验证码",
    disabled: false,
    mobile: '',
    validateCode: '',
    id_token: '',//方便存在本地的locakStorage  
    response: '', //存取返回数据 
  },
  onLoad: function (options) {
   

    var userIdEnc = wx.getStorageSync('userIdEnc'); //获取本地缓存中的userIdEnc
    var loginDevice = wx.getStorageSync('loginDevice');//获取本地缓存中的loginDevice
    // console.log("////", userIdEnc, loginDevice);
    if (userIdEnc != '' || loginDevice!=''){  //判断用户是否登录，已登录则直接跳转到首页
        var that = this;
        that.redirectToIndex();
       // wx.navigateTo({ url: '../../pages/template/template' }); //template弹窗
    }
  },
  // 登录&注册手机验证
  loginPhone: function (e) {
    var mobile = e.detail.value;
    this.setData({
      mobile: mobile,
    })
    if (!(/^1[34578]\d{9}$/.test(mobile))) {
      // this.setData({
      //   mobile: mobile,
      // })
      // this.setData({
      //   ajxtrue: false
      // })
      // if (phone.length >= 11) {
      //   wx.showToast({
      //     title: '手机号有误',
      //     icon: 'error',
      //     image: '../../images/error.png',
      //     duration: 2000
      //   })
      // }
    } else {
      // this.setData({
      //   ajxtrue: true  
      // })
      // userName= e.detail.value
    }
  },
  validateCode: function (e) {
    var validateCode= e.detail.value
    this.setData({
      validateCode: validateCode,
    })
    // console.log(e.detail.value)
  }, 
  pwCode:function(e){
    var that = this
    // console.log(mobile);
    var mobile = that.data.mobile;
    if (mobile==''){
      app.toastShow(this, "请输入手机号", "error");
    }else {
      
      if (timer == 1) {
        timer = 0
        var that = this
        var time = 60
        that.setData({
          sendmsg: "weui-vcode-btn btn-gray-bg",
          disabled: true,
        })
        var inter = setInterval(function () {
          that.setData({
            getmsg: time + "s后重新发送",
          })
          time--
          if (time < 0) {
            timer = 1
            clearInterval(inter)
            that.setData({
              sendmsg: "weui-vcode-btn",
              getmsg: "获取短信验证码",
              disabled: false,
            })
          }
        }, 1000)


        var appid = getApp().globalData.appid; //appid wxf79825c96701f981
        var timestamp = Date.parse(new Date());//获取当前时间戳 
        timestamp = timestamp / 1000;
        var version = getApp().globalData.version; //版本号
        var sign = getApp().globalData.sign; //签名
        var validateWay = getApp().globalData.validateWay; //验证方式 1:短信
        var validateType = getApp().globalData.validateType; //功能类型 1注册 2 登录
        var data = { "appId": appid, "timestamp": timestamp, "version": version, "mobile": mobile, "validateWay": validateWay, "validateType": validateType }
        var url = getApp().globalData.url; //路径
        var key = getApp().globalData.appkey;  //加密k值 
        var encryption = utils.encryption(key, data)
       
        sign = encryption;//赋值给签名
        data.sign = sign;
        data = JSON.stringify(data);
          // console.log('算出签名的data结果：', data)


        wx.request({
          method: "post",
          url: url+'/user/validate/gainValidateCode', //验证码接口
          data: data + '@#@' + appid
          ,
          dataType: "json",
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            // console.log(res.data);


          },
          fail: function (res) {
            console.log('is failed',res.data);
          }
        })


      } 
    }
  
  },
  showTopTips:function(e){ //登录/注册提交事件
  
    if (this.data.mobile==''){
      app.toastShow(this, "请输入手机号", "error");
    } else if (this.data.validateCode==''){
      app.toastShow(this, "请输入验证码", "error");
    }else{
      var that = this
      wx.login({//调用获取用户openId
        success: function (res) {

          var loginDevice = getApp().globalData.loginDevice; //唯一标识 = W + 用户名
          loginDevice = loginDevice + res.code //临时code值
          var appid = getApp().globalData.appid; //appid
          var timestamp = Date.parse(new Date());//获取当前时间戳 
          timestamp = timestamp / 1000;
          var version = getApp().globalData.version; //版本号
          var sign = getApp().globalData.sign; //签名
          var mobile = that.data.mobile;
          var validateCode = that.data.validateCode; //手持设备标识
          var loginChannel = getApp().globalData.loginChannel; //登录渠道:1001 ios手机 1002 android手机 1003 微信小程序 1004 手机H5
          var data = {"appId": appid,"timestamp": timestamp,"version":version,"mobile": mobile,"validateCode": validateCode, "loginChannel":loginChannel, "loginDevice": loginDevice};
          var url = getApp().globalData.url; //接口路径
          var key = getApp().globalData.appkey;  //加密k值 
          var encryption = utils.encryption(key, data) //算出签名
          sign = encryption;//赋值给签名
          data.sign = sign;
          data = JSON.stringify(data);
          // console.log('算出签名的data结果：', data)
          
          wx.request({
            method: "post",
            url: url+'/user/baseInfo/userLogin', //登录/注册
            data: data + '@#@' + appid,
            dataType: "json",
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function (res) {
              // debugger;
              console.log('注册/登录信息',res);
             
              
              if (res.data.code == '0000') {
                var userIdEnc = res.data.data.userIdEnc;
                var loginDevice = res.data.data.loginDevice;
                console.log('请求成功后赋值--', 'userIdEnc:', userIdEnc, 'loginDevice:', loginDevice);
                 wx.setStorage({
                  key: 'userIdEnc',
                  data: userIdEnc,
                  success: function (res) {
                    console.log("loginDevice00000002", res)

                  }, fail: function (res) {
                    console.log("loginDevice00000003", res)
                  }
                })
                wx.setStorage({
                  key: 'loginDevice',
                  data: loginDevice,
                  success: function (res) {
                    console.log("用户唯一标识存入缓存成功", res)

                  }, fail: function (res) {
                    console.log("用户唯一标识存入缓存失败", res)
                  }
                })
                that.redirectToIndex();
                // console.log("loginDevice1111111",userIdEnc)
              } else if (res.data.code == '1002') { //超时
                that.errorShow('超时');
              } else if (res.data.code == '1002') { //帐号冻结
                that.errorShow('帐号冻结');
              } else if (res.data.code == '2006') { //已在其他设备上登录
                var userIdEnc = res.data.data.userIdEnc;
                var loginDevice = res.data.data.loginDevice;
                console.log('请求成功后赋值--', 'userIdEnc:', userIdEnc, 'loginDevice:', loginDevice);
                //将后台返回的用户唯一标识存入本地缓存中
                wx.setStorage({
                  key: 'userIdEnc',
                  data: userIdEnc,
                  success: function (res) {
                    console.log("用户唯一标识存入缓存成功", res)
                    
                  }, fail: function (res){
                    console.log("用户唯一标识存入缓存失败", res)
                  }
                })
                wx.setStorage({
                  key: 'loginDevice',
                  data: loginDevice,
                  success: function (res) {
                    console.log("loginDevice00000002", res)
                  
                  }, fail: function (res) {
                    console.log("loginDevice00000003", res)
                  }
                })
                that.redirectToIndex();
                console.log("登录成功",userIdEnc)
              } else if (res.data.code == '2005') { //手机未注册
                that.errorShow('手机未注册');
              } else if (res.data.code == '2002') { //动态验证码错误或已失效
                that.errorShow('动态验证码错误或已失效');
              } else if (res.data.code == '1000') { //系统异常
                that.errorShow('系统异常');
              }else {  //失败
                that.errorShow('注册/登录失败1');
              }

            },
            fail: function (res) {
              that.errorShow('注册/登录失败2');
              //console.log(res.data);
              console.log('is failed')
            }
          })



        }, fail: function (res) {
          console.log('获取临时code失败！' + res.errMsg)
        }
      })
      
    }
  },
  errorShow: function (error) { //统一调用错误提醒tips
    wx.showToast({
      title: error,
      icon: 'error',
      image: '../../images/error.png',
      duration: 2000
    })
  }, redirectToIndex:function(){  //统一跳转到首页
    wx.redirectTo({
      url: '../../pages/index/index',
    })
  }

  
})