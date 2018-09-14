//index.js

var markers = [];//地图标记点
var callout = [];//地图标记点的气泡

//获取应用实例
var app = getApp()

Page({
  data: {
    scale:18,
    latitude:0,
    longitude:0,
    //markers: [],// 地图上控件数组
  },
  onLoad:function(options){
    // 1.页面初始化 options为页面跳转所带来的参数
    var that = this;
    // 2.调用wx.getLocation系统API,获取并设置当前位置经纬度
    this.timer = options.timer;// 2.1.获取定时器，用于判断是否已经在计费
   
    

    // 3.设置地图控件的位置及大小，通过设备宽高定位
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
                top: res.windowHeight - 200,// 根据设备高度设置top值，可以做到在不同设备上效果一致
                width: 50,// 单位px
                height: 50,// 单位px
                
              },
              clickable:true,
            },{
              id: 2, //报修按钮
              iconPath: '../../images/index/customerService.png',
              position: {
                left: 30,// 单位px
                top: res.windowHeight - 140,// 根据设备高度设置top值，可以做到在不同设备上效果一致
                width: 50,// 单位px
                height: 50,// 单位px
              },
              clickable: true,
            }, {
              id: 3,  //扫码洗衣按钮
              iconPath: '../../images/index/ImmediateUse.png',
              position: {
                left: 30,// 单位px
                top: res.windowHeight - 80,// 根据设备高度设置top值，可以做到在不同设备上效果一致
                width: res.screenWidth - 60,// 单位px
                height: 60,// 单位px
              },
              clickable: true,
            }, {
              id: 4, //个人中心按钮
              iconPath: '../../images/user-icon.png',
              position: {
                left: res.screenWidth - 59,// 单位px
                top: res.windowHeight - 140,// 根据设备高度设置top值，可以做到在不同设备上效果一致
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
      }
    })   
    //4,查询洗衣机站列表
    that.getLocationShow(that); //初始化地图坐标
   


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
      case 3:wx.scanCode({  //扫码洗衣
        
        success: (res) => {
          this.show = "结果:" + res.result + "二维码类型:" + res.scanType + "字符集:" + res.charSet + "路径:" + res.path;
          that.setData({
            show: this.show,
            result: res.result
          })
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 2000
          })
        },
        fail: (res) => {
          wx.showToast({
            title: '失败',
            icon: 'success',
            duration: 2000
          })
        },
        complete: (res) => {
        } 
      }),
      wx.navigateTo({ url: '../workingMode/workingMode' });
      break;
      case 4: wx.navigateTo({ url: '../personal/personal' });  //用户中心
      break;
    }
  },
  // 定位函数，移动位置到地图中心
  moveToLocation:function(){
    this.mapCtx.moveToLocation()
  },
  
  // 地图标记点击事件，连接用户位置和点击的单车位置
  bindmarkertap: function (e) {
    let _markers = this.data.markers; // 拿到标记数组
    console.log("=======", _markers)
    let markerId = e.markerId; // 获取点击的标记id
    console.log("=======", markerId)
    let currMaker = _markers[markerId]; // 通过id,获取当前点击的标记
    console.log("=======", _markers[markerId])
    
    console.log("+++++++++", this.data)
    this.setData({
      polyline: [{
        points: [{ // 连线起点
          longitude: this.data.longitude,
          latitude: this.data.latitude
        }, { // 连线终点(当前点击的标记)
          longitude: currMaker.longitude,
          latitude: currMaker.latitude
        }],
        color: "#FF0000DD",
        width: 1,
        dottedLine: true
      }],
      scale: 18
    })
  },
  // 拖动地图，获取附件洗衣机位置
  bindregionchange: function (e) {
   
    
   // that.siteInfoList();
    console.log(e.type)
    if (e.type == "begin") {
      var that = this;
      // that.siteInfoList();
      this.setData({
        // mark= res.data.data
      })
      // 停止拖动，显示洗衣机位置
    } else if (e.type == "end") {
     // console.log(".........",this.data);
      this.setData({
        markers: this.data._markers
      })
    }
  },
  getLocationShow: function (that) {  //查询洗衣机站列表
    wx.getLocation({
      type: "gcj02",
      success: (res) => {
        this.setData({
          longitude: res.longitude,
          latitude: res.latitude
        })

        console.log(res);

    var appid = '1100310183560349'; //appid wxf79825c96701f981

    var timestamp = Date.parse(new Date());//获取当前时间戳 
    timestamp = timestamp / 1000;
    var version = '1.0'; //版本号
    var sign = 'erwlkrjlkwjelrjwlke'; //签名
    var currentLatitude = res.latitude;  //纬度
    var currentLongitude = res.longitude; //经度
    var rang = 10000;  //范围【单位米】
    
    wx.request({ //获取当前定位经续度作为条件传入后台查询当前附近10公里范围内机站坐标列表
      method: "post",
      url: 'http://uat.kingxiyun.com/xiaoyou/site/siteManage/siteInfoList',
      data: '{"appId": "' + appid + '", "timestamp": ' + timestamp + ', "version": "' + version + '", "sign": "' + sign + '", "latitude": "' + currentLatitude + '","longitude":"' + currentLongitude + '","rang":"' + rang + '" }@#@1100310183560349',
      header: {
        'content-type': 'application/json'
      },
      dataType: "json",
      success: function (res) {

        if (res.data.code == '0000') {

          var listData = res.data.data.siteInfoList;
          // var siteInfoList = [];
          // for (var i = 0; i < siteInfoData.length; i++) {
          //   var str = siteInfoData[i];
          //   siteInfoList.push({ latitude: str.latitude, longitude: str.longitude });
          // }
          // console.log(listData);

          for (var i = 0; i < listData.length; i++) {
            markers = markers.concat({
              iconPath: "../../images/index/dizhi.png",
              id: listData[i].sid,
              latitude: listData[i].latitude,
              longitude: listData[i].longitude,
              width: 40,
              height: 46,
              clickable: false,
            });

          }
          // console.log(markers)
          that.setData({
            markers: markers,
            latitude: listData[0].latitude,
            longitude: listData[0].longitude
          })




        } else {
          wx.showToast({
            title: '请求失败',
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
  }, 
  // ajaxState:function(res){
  //   console.log(res.data.code)
  //   if (res.data.code == '0000') {
  //     wx.showToast({
  //       title: '请求成功',
  //       icon: 'error',
  //       image: '../../images/error.png',
  //       duration: 2000
  //     })
  //   } else {
  //     wx.showToast({
  //       title: '请求失败',
  //       icon: 'error',
  //       image: '../../images/error.png',
  //       duration: 2000
  //     })
  //   }
  // }
 


})
