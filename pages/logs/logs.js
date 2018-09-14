//logs.js
const util = require('../../utils/util.js')
var app = getApp();

var phone;
var timer = 1;
var userName ='';
var userPassword = '';
var timestamp = Date.parse(new Date());//获取当前时间戳 
timestamp = timestamp / 1000; 
var loginChannel = '1003'; //登录渠道:1001 ios手机 1002 android手机 1003 微信小程序 1004 手机H5
var loginDevice = 'W'; //唯一标识 = W + 用户名
var wechatInfo;  //微信版本号
Page({
  data: {
    sendmsg: "weui-vcode-btn",
    getmsg: "获取短信验证码",
    disabled: false,
    userName: '',
    userPassword: '',
    id_token: '',//方便存在本地的locakStorage  
    response: '' //存取返回数据 
  },
  // 登录&注册手机验证
  loginPhone: function (e) {
    phone = e.detail.value;
    if (!(/^1[34578]\d{9}$/.test(phone))) {
      this.setData({
        ajxtrue: false
      })
      if (phone.length >= 11) {
        wx.showToast({
          title: '手机号有误',
          icon: 'error',
          image: '../../images/error.png',
          duration: 2000
        })
      }
    } else {
      this.setData({
        ajxtrue: true  
      })
      userName= e.detail.value
    }
  },
  userPassword: function (e) {
    userPassword= e.detail.value
    // console.log(e.detail.value)
  }, 
  pwCode:function(e){
    var that = this
    console.log(phone);
    if (userName==''){
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
        wx.request({
          method: "post",
          url: 'http://7hzwgf.natappfree.cc/user/validate/gainValidateCode', //仅为示例，并非真实的接口地址
          data: '{"appId": "1100310183560349", "timestamp": 1510369871, "version": "1.0", "sign": "erwlkrjlkwjelrjwlke", "mobile": "' + userName + '", "validateWay": 1, "validateType": 2 }@#@1100310183560349'
          ,
          dataType: "json",
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            // console.log(res.data);


          },
          fail: function (res) {
            console.log(res.data);
            console.log('is failed')
          }
        })


      } 
    }
  
  },
  showTopTips:function(e){ //提交事件
    wx.redirectTo({
      url: '../../pages/index/index',
    })
    if (userName==''){
      app.toastShow(this, "请输入手机号", "error");
    } else if (userPassword==''){
      app.toastShow(this, "请输入验证码", "error");
    }else{
      //console.log("点击登录")

      var that = this
      that.version(); //调用获取微信版本号方法
      that.openId();//调用获取用户openId
      console.log("手机号：" + userName + ",验证码：" + userPassword + ",登录渠道：" + loginChannel + ",用户唯一标识："+ loginDevice)
      wx.request({
        method: "post",
        url: 'http://uat.kingxiyun.com/xiaoyou/user/baseInfo/userLogin', //仅为示例，并非真实的接口地址
        data: '{"appId": "1100310183560349", "timestamp": 1510369871, "version": "1.0", "sign": "erwlkrjlkwjelrjwlke", "mobile": "' + userName + '","validateCode":"' + userPassword + '","loginChannel":"' + loginChannel + '","loginDevice":"' + loginDevice +'", "validateWay": 1, "validateType": 2 }@#@1100310183560349'
        ,
        dataType: "json",
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
         
          that.setData({
            id_token: res.data.id_token,
            response: res
          })
          try {
            wx.setStorageSync('id_token', res.data.id_token)
          } catch (e) {
          }
          
         
          if(res.code == '0000'){
            wx.redirectTo({
              url: '../../pages/index/index',
            })
          } else if (res.code == '1002') { //超时
            wx.showToast({
              title: '已超时',
              icon: 'error',
              image: '../../images/error.png',
              duration: 2000
            })
          } else if (res.code == '1002') { //帐号冻结
            wx.showToast({
              title: '帐号已冻结，请联系客服',
              icon: 'error',
              image: '../../images/error.png',
              duration: 2000
            })
          } else {
            wx.showToast({
              title: '注册/登录失败',
              icon: 'error',
              image: '../../images/error.png',
              duration: 2000
            })
          }
          
        },
        fail: function (res) {
          //console.log(res.data);
          console.log('is failed')
        }
      })
    }
  },
  version: function (e) {//获取微信版本号
    wx.getSystemInfo({
      success: function (res) {
        //console.log(res.version);
        wechatInfo = res.version;
      }
    })
  },
  openId: function (e) { //获取用户openId
    
    wx.login({
      success: function (res) {
       
        if (res.code) {
          loginDevice = loginDevice + res.code //临时code值
         
        } else {
          console.log('获取临时code失败！' + res.errMsg)
        }
      }
    })
  
  }

  // formSubmit: function (e) {
  //   console.log('form发生了submit事件，携带数据为：', e.detail.value)
  // },
  
})