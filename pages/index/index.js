//index.js
//获取应用实例
var app = getApp()
var utils = require('../../utils/util.js');
var QQMapWX = require('../../utils/js/qqmap-wx-jssdk.js');
Page({
  data: {
    scale:18,
    latitude:0,
    longitude:0,
    markers: [],// 地图上控件数组
    navigationMarkers:[],
  },
  onLoad:function(options){
   
  
    var that = this;

   
    
    //1.调取本地缓存数据，判断用户是否有正在进行的订单
    var appid = getApp().globalData.appid; //appid wxf79825c96701f981
    var timestamp = Date.parse(new Date());//获取当前时间戳 
    timestamp = timestamp / 1000;
    var version = getApp().globalData.version; //版本号
    var sign = getApp().globalData.sign; //签名

    var usenc = wx.getStorageSync('userIdEnc'); //获取本地缓存中的userIdEnc //用户唯一识别码 getStorageSync
    var userIdEnc = wx.getStorageSync('userIdEnc'); //获取本地缓存中的userIdEnc //用户唯一识别码
    var devimark = wx.getStorageSync('loginDevice');//获取本地缓存中的loginDevice
    var url = getApp().globalData.url; //接口路径
    var key = getApp().globalData.appkey;  //加密k值 
    
    var data = {"appId":appid,"timestamp": timestamp,"version":version,"userIdEnc":userIdEnc};
    var encryption = utils.encryption(key, data)
    sign = encryption;//赋值给签名
    data.sign = sign;
    data = JSON.stringify(data);
    // console.log('返回加密结果index：', data)
    var header = {
      'content-type': 'application/json',
      'cookie': "devimark=" + devimark + ";" + "usenc=" + usenc,
    };

    // console.log("//查询进行中订单的参数\\", devimark, appid, timestamp, timestamp, version, sign, 'userIdEnc---',userIdEnc)
    wx.request({ //查询进行中订单
      method: "post",
      url: url+'/order/washing/queryUserOngoingWashingOrderList',
      data: data+'@#@' + appid,
      header: header,
      dataType: "json",
      success: function (res) {
        // console.log('加密验证查询进行中订单:', res);
        var statusPay = res.data.code;
        if (statusPay == '0000') { //查询进行中订单成功
          var washingOrderList = res.data.data.washingOrderList; //根据返回的数据列表是否有值 来判断是否有进行中的订单，查询成功也有可能没有订单
          // console.log("查询进行中订单成功", res)
          if (washingOrderList == '') {
            // console.log("查询进行中订单成功,但没有进行中的订单", res)
            // that.errorShow('没有进行中订单');
            
          } else {
            var systemOrderNo = washingOrderList[0].systemOrderNo; //查询进行中订单成功且有订单编号，将编号传递到洗衣正在进行中的页面显示
            // console.log("0000", systemOrderNo)
            var deviceCode = washingOrderList[0].deviceCode; //洗衣机编号
            wx.navigateTo({ url: '../../pages/workHave/workHave?systemOrderNo=' + systemOrderNo + '&deviceCode=' + deviceCode});
          }

        } else if (statusPay == '2000') { //失败
          that.errorShow('查询失败');
          // that.redirectToIndex();
        } else if (statusPay == '2012') { //非有效用户
          that.errorShow('帐户冻结');
          var userIdEnc = wx.getStorageSync('userIdEnc'); //获取本地缓存中的userIdEnc
          var loginDevice = wx.getStorageSync('loginDevice');//获取本地缓存中的loginDevice
          wx.removeStorageSync('userIdEnc', userIdEnc);//将userIdEnc从本地缓存清除
          wx.removeStorageSync('loginDevice', loginDevice);//将loginDevice从本地缓存清除
          wx.reLaunch({
            url: '../../pages/logs/logs',
          })
        } else if (statusPay == '2014') { //用户没有登录
          that.errorShow('用户没有登录');
          var userIdEnc = wx.getStorageSync('userIdEnc'); //获取本地缓存中的userIdEnc
          var loginDevice = wx.getStorageSync('loginDevice');//获取本地缓存中的loginDevice
          wx.removeStorageSync('userIdEnc', userIdEnc);//将userIdEnc从本地缓存清除
          wx.removeStorageSync('loginDevice', loginDevice);//将loginDevice从本地缓存清除
          wx.reLaunch({
            url: '../../pages/logs/logs',
          })
        } else {  //系统异常
          that.errorShow('系统异常');
          // that.redirectToIndex();
        }

      }, fail: function (res) {
        console.log("查询进行中订单失败", res)
      }
    })






    // 2.初始化地图控件的位置及大小，通过设备宽高定位
    wx.getSystemInfo({
      success:function(res){
        //console.log(res)
        that.setData({
          // 定义控件数组，可以在data对象初始化为[],也可以不初始化，取决于是否需要更好的阅读
          controls:[
            {
              id:1, //定位按钮
              iconPath:'../../images/index/location.png',
              position:{
                left: 30,// 单位px
                top: res.windowHeight - 240,// 根据设备高度设置top值，可以做到在不同设备上效果一致
                width: 50,// 单位px
                height: 50,// 单位px
                
              },
              clickable:true,
            },{
              id: 2, //报修按钮
              iconPath: '../../images/index/customerService.png',
              position: {
                left: 30,// 单位px
                top: res.windowHeight - 180,// 根据设备高度设置top值，可以做到在不同设备上效果一致
                width: 50,// 单位px
                height: 50,// 单位px
              },
              clickable: true,
            }, 
            // {
            //   id: 3,  //扫码洗衣按钮
            //   iconPath: '../../images/index/ImmediateUse.png',
            //   position: {
            //     left: 30,// 单位px
            //     top: res.windowHeight - 80,// 根据设备高度设置top值，可以做到在不同设备上效果一致
            //     width: res.screenWidth - 60,// 单位px
            //     height: 60,// 单位px
            //   },
            //   clickable: true,
            // }, 
            {
              id: 4, //个人中心按钮
              iconPath: '../../images/user-icon.png',
              position: {
                left: res.screenWidth - 59,// 单位px
                top: res.windowHeight - 180,// 根据设备高度设置top值，可以做到在不同设备上效果一致
                width:  59,// 单位px
                height: 50,// 单位px
              },
              clickable: true,
            },{
              id: 5,//地图中心标记点
              iconPath: '../../images/index/marker.png',
              position: {
                left: res.windowWidth / 2 - 10,// 单位px
                top: res.windowHeight / 2 - 17,// 根据设备高度设置top值，可以做到在不同设备上效果一致
                width: 20,// 单位px
                height: 34,// 单位px
              },
              clickable: false,
            }
          ],
        })




        // 3，查询当前定位10公里范围内的洗衣机站列表
        wx.getLocation({ //获取当前的地理位置【定位】
          type: "gcj02",
          success: (res) => {
            that.setData({
              longitude: res.longitude,
              latitude: res.latitude
            })
            
            var userLongitude =  res.longitude;
            var userLatitude  = res.latitude;
            // console.log("////获取地理信息////", userLongitude);


            var appid = getApp().globalData.appid; //appid 
            var timestamp = Date.parse(new Date());//获取当前时间戳 
            timestamp = timestamp / 1000;
            var version = getApp().globalData.version; //版本号
            var sign = getApp().globalData.sign; //签名
            var url = getApp().globalData.url; //接口路径
            var currentLatitude = (res.latitude).toFixed(6);  //纬度 截取小数点后6位
            var currentLongitude = (res.longitude).toFixed(6); //经度
            var rang = getApp().globalData.rang;  //范围【单位米】
            var mapType = getApp().globalData.mapType;
            var data = { "appId": appid, "timestamp": timestamp, "version": version, "latitude": currentLatitude, "longitude": currentLongitude, "rang": rang, "mapType":mapType};
            var key = getApp().globalData.appkey;  //加密k值 
            var encryption = utils.encryption(key, data) //算出签名
            sign = encryption;//赋值给签名
            data.sign = sign;
            data = JSON.stringify(data);
          // console.log('算出签名的data结果：', data)


            wx.request({ //获取当前定位经续度作为条件传入后台查询当前附近10公里范围内机站坐标列表
              method: "post",
              url: url+'/site/siteManage/siteInfoList',
              data: data + '@#@' + appid,
              header: {
                'content-type': 'application/json'
              },
              dataType: "json",
              success: function (res) {
                // console.log("附近10公里范围内机站坐标列表", res)
                if (res.data.code == '0000') {

                  var listData = res.data.data.siteInfoList;
                  console.log('附近10公里范围内机站坐标列表', listData)
                  that.setData({
                    navigationMarkers: listData, //获取原始站点列表存入导航时要使用的集合中，因本集合有有许多数据在markers中用不到，所以分开
                  })
                  var markers = [];
                  for (var i = 0; i < listData.length; i++) {
                    // var markersList = that.reverseLocation(listData[i].latitude, listData[i].longitude)  //调用腾讯地图SDK转换百度地图经纬度
                    markers = markers.concat({
                      iconPath: "../../images/index/dizhi.png",
                      id: listData[i].sid,
                      latitude: Number(listData[i].latitude),
                      longitude: Number(listData[i].longitude),
                      width: 50,
                      height: 58,
                      clickable: false,
                    });

                  }
                  // console.log("组装完成后的洗衣机站点列表", markers)

                  that.setData({
                    markers: markers,
                  })
        
                } else {
                  wx.showToast({
                    title: '查询洗衣机站列表失败',
                    icon: 'error',
                    image: '../../images/error.png',
                    duration: 2000
                  })
                  console.log(res)
                }

              }, fail: function (res) {
                console.log(res)
              }
            })

          }
        });







      }
    })   


  },
  onShow:function(){
    this.mapCtx = wx.createMapContext('myMap');
    this.moveToLocation;
  },
  onReady: function (e) {
    
    
  },
 
  bindcontroltap: function (e) {// 地图控件点击事件
    var that = this;
    // 判断点击的是哪个控件 e.controlId代表控件的id，在页面加载时的第3步设置的id
    switch (e.controlId) {
      case 1: that.moveToLocation();  //定位
      break;
      case 2: wx.navigateTo({ url: '../equipmentRepair/equipmentRepair' });  //报修
      break;
      // case 3: that.scanCodeBtn(); //扫码洗衣
      // break;
      case 4: wx.navigateTo({ url: '../personal/personal' });  //用户中心
      break;
    }
  },
  // 定位函数，移动位置到地图中心
  moveToLocation:function(){
    this.mapCtx.moveToLocation()
  },
  
  // 地图标记点击事件，连接用户位置和点击的单车位置并规划导航线路
  bindmarkertap: function (e) {
    var navigationMarkers = this.data.navigationMarkers; // 拿到标记数组
    // console.log("=======", navigationMarkers)
    var markerId = e.markerId; // 获取点击的标记id
 
    var siteName = '';
    var siteAddress = '';
    var siteLatitude ='';
    var siteLongitude = '';
    for (var i = 0; i < navigationMarkers.length;i++){
      if (navigationMarkers[i].sid == markerId){
        siteName = navigationMarkers[i].siteName;
        siteAddress = navigationMarkers[i].detailAddress;
        siteLatitude = Number(navigationMarkers[i].latitude);
        siteLongitude = Number(navigationMarkers[i].longitude);
        }
    }
    // console.log("===导航目标数据====", siteName, siteAddress, siteLatitude, siteLongitude)
    wx.openLocation({  //调用地图路线规划
      latitude: siteLatitude,
      longitude: siteLongitude,
      scale: 18,
      name: siteName,
      address: siteAddress
    });

  },
  // 拖动地图，获取附件洗衣机位置
  bindregionchange: function (e) {
   
    var that = this;
   
    
    if (e.type == "begin") {
      
      var appid = getApp().globalData.appid; //appid
      var timestamp = Date.parse(new Date());//获取当前时间戳 
      timestamp = timestamp / 1000;
      var version = getApp().globalData.version; //版本号
      var sign = getApp().globalData.sign; //签名
      var currentLatitude = (this.data.latitude).toFixed(6);  //纬度
      var currentLongitude = (this.data.longitude).toFixed(6); //经度
      var url = getApp().globalData.url; //接口路径
      var rang = getApp().globalData.rang;;  //范围【单位米】
      var mapType = getApp().globalData.mapType;
      var data = { "appId": appid, "timestamp": timestamp, "version": version, "latitude": currentLatitude, "longitude": currentLongitude, "rang": rang, "mapType": mapType};
      
      var key = getApp().globalData.appkey;  //加密k值 
      var encryption = utils.encryption(key, data) //算出签名
      sign = encryption;//赋值给签名
      data.sign = sign;
      data = JSON.stringify(data);
          // console.log('算出签名的data结果：', data)

      wx.request({ //获取当前定位经续度作为条件传入后台查询当前附近10公里范围内机站坐标列表
        method: "post",
        url: url+'/site/siteManage/siteInfoList',
        data: data+'@#@' + appid,
        header: {
          'content-type': 'application/json'
        },
        dataType: "json",
        success: function (res) {

          if (res.data.code == '0000') {

            var listData = res.data.data.siteInfoList;
            that.setData({
              navigationMarkers: listData, //获取原始站点列表存入导航时要使用的集合中，因本集合有有许多数据在markers中用不到，所以分开
            })
            var markers = [];
            for (var i = 0; i < listData.length; i++) {
              markers = markers.concat({
                iconPath: "../../images/index/dizhi.png",
                id: listData[i].sid,
                latitude: listData[i].latitude,
                longitude: listData[i].longitude,
                width: 50,
                height: 58,
                clickable: false,
              });

            }
            // console.log(markers);
            that.setData({
              markers: markers,
            })



          } else {
            wx.showToast({
              title: '拖动地图，获取洗衣机位置失败',
              icon: 'error',
              image: '../../images/error.png',
              duration: 2000
            })
            console.log(res)
          }

        }, fail: function (res) {
          console.log(res)
        }
      })

      // 停止拖动，显示洗衣机位置
    } else if (e.type == "end") {
      // console.log("------停止拖动，显示洗衣机位置----",this.data);
      this.setData({
        // markers: this.data._markers
      })
    }
  },
  scanCodeBtn:function(){ //扫码洗衣
    var that = this;

    var appid = getApp().globalData.appid; //appid
    var timestamp = Date.parse(new Date());//获取当前时间戳 
    timestamp = timestamp / 1000;
    var version = getApp().globalData.version; //版本号
    var sign = getApp().globalData.sign; //签名
    var url = getApp().globalData.url; //接口路径
    var usenc = wx.getStorageSync('userIdEnc'); //获取本地缓存中的userIdEnc //用户唯一识别码
    var userIdEnc = wx.getStorageSync('userIdEnc'); //获取本地缓存中的userIdEnc //用户唯一识别码
    var devimark = wx.getStorageSync('loginDevice');//获取本地缓存中的loginDevice
    var header = {
      'content-type': 'application/json',
      'cookie': "devimark=" + devimark + ";" + "usenc=" + usenc,
    };
    var data = {"appId":appid,"timestamp":timestamp ,"version":version,"userIdEnc":userIdEnc}
    var key = getApp().globalData.appkey;  //加密k值 
    var encryption = utils.encryption(key, data) //算出签名
    sign = encryption;//赋值给签名
    data.sign = sign;
    data = JSON.stringify(data);
    // console.log('算出签名的data结果：', data)

    // console.log("//查询进行中订单参数\\", devimark, appid, timestamp, timestamp, version, sign, userIdEnc)
    wx.request({ //查询进行中订单
      method: "post",
      url: url+'/order/washing/queryUserOngoingWashingOrderList',
      data: data + '@#@' + appid,
      header: header,
      dataType: "json",
      success: function (res) {
        var statusPay = res.data.code;
        if (statusPay == '0000') { //查询进行中订单成功
          var washingOrderList = res.data.data.washingOrderList; //根据返回的数据列表是否有值 来判断是否有进行中的订单，查询成功也有可能没有订单
          if (washingOrderList != ''){
            var systemOrderNo = washingOrderList[0].systemOrderNo; //查询进行中订单成功且有订单编号，将编号传递到洗衣正在进行中的页面显示
            var deviceCode = washingOrderList[0].deviceCode
            // console.log("0000", washingOrderList)
            wx.navigateTo({ url: '../../pages/workHave/workHave?systemOrderNo=' + systemOrderNo + '&deviceCode=' + deviceCode })
          }else{
            scanCode()
          }
          

        } else {  //系统异常
          scanCode()
        }

      }, fail: function (res) {
        console.log("查询进行中订单失败", res)
        // scanCode()
      }
    })





    function scanCode(){
      wx.scanCode({  //扫码洗衣

        success: (res) => { //扫码成功
      

          var appid = getApp().globalData.appid; //appid
          var timestamp = Date.parse(new Date());//获取当前时间戳 
          timestamp = timestamp / 1000;
          var version = getApp().globalData.version; //版本号
          var sign = getApp().globalData.sign; //签名
          var deviceCode = res.result; //洗衣机编号
          var data = {"appId":appid ,"timestamp":timestamp,"version":version,"deviceCode":deviceCode};
          var url = getApp().globalData.url; //接口路径
          var key = getApp().globalData.appkey;  //加密k值 
          var encryption = utils.encryption(key, data) //算出签名
          sign = encryption;//赋值给签名
          data.sign = sign;
          data = JSON.stringify(data);
          // console.log('算出签名的data结果：', data)


          wx.request({ //请求洗衣模式列表
            method: "post",
            url: url+'/device/washing/queryWorkModeAndPriceList',
            data: data + '@#@' + appid,
            header: {
              'content-type': 'application/json'
            },
            dataType: "json",
            success: function (res) {
             
              var status = res.data.code;
              if (status == '0000') {
                //that.errorShow('扫码成功');

                var workModeAndPriceList = res.data.data.workModeAndPriceList;
                var deviceId = res.data.data.deviceId

                wx.navigateTo({ url: '../workingMode/workingMode?workModeAndPriceList=' + JSON.stringify(workModeAndPriceList) + '&deviceId=' + deviceId + '&deviceCode=' + deviceCode });

              } else if (status == '2007') { //设备不存在
                that.errorShow('设备不存在');
              } else if (status == '2017') { //洗衣机已被使用
                that.errorShow('洗衣机已被使用');
              } else if (status == '2018') { //洗衣机盖没关
                that.errorShow('洗衣机盖没关');
              } else if (status == '2019') { //洗衣机故障
                that.errorShow('洗衣机故障');

               



              } else if (status == '2020') { //洗衣机消毒中
                that.errorShow('洗衣机消毒中');
              } else {  //设备异常
                that.errorShow('设备异常');
              }

            }, fail: function (res) {
              console.log("请求洗衣模式列表失败", res)
            }
          })


        },
        fail: (res) => {
          that.errorShow('扫码失败');
          console.log("fail", res);
        },
        complete: (res) => {

        }
      });
    }


    
  },
  scavenging:function(){
      // console.log("扫码mmmmmmmmmm");
    this.scanCodeBtn();
  },
  reverseLocation: function (latitude, longitude) {
    var that = this;
    // 实例化API核心类
    var demo = new QQMapWX({
      key: 'WO7BZ-N5AWK-HV6JT-AAOKY-GY6VK-O2BWZ' // 必填
    });
    // 调用接口
    var latitude = latitude;
    var longitude = longitude;
    // console.log(latitude, longitude);
    demo.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude
      },
      coord_type: 3,//baidu经纬度
      success: function (res) {
        var markersList = {};

        var location = res.result.ad_info.location;
        console.log('baidu经纬度',that.data.name)
      }
    });

  },
  errorShow: function (error){ //统一调用错误提醒tips
    wx.showToast({
      title: error,
      icon: 'error',
      image: '../../images/error.png',
      duration: 2000
    })
  }
  
 


})
