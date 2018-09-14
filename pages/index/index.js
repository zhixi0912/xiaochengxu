//index.js
//获取应用实例
var app = getApp()

var rest=[
    {
      "id": 0,
      "title": "去这里",
      "iconPath": "../../images/index/machine.png",
      "latitude": 32.25956,
      "longitude": 121.52609,
      "width": 45,
      "height": 50
    }
    , {
      "id": 1,
      "title": "去这里",
      "iconPath": "../../images/index/machine.png",
      "latitude": 32.25956,
      "longitude": 122.52609,
      "width": 45,
      "height": 50
    },{
      "id": 2,
      "title": "去这里",
      "iconPath": "../../images/index/machine.png",
      "latitude": 31.25956,
      "longitude": 122.52609,
      "width": 45,
      "height": 50
    }, {
      "id": 3,
      "title": "去这里",
      "iconPath": "../../images/index/machine.png",
      "latitude": 31.25956,
      "longitude": 120.52609,
      "width": 45,
      "height": 50
    }
  ]

Page({
  data: {
    scale:18,
    latitude:0,
    longitude:0,
    markers: [],// 地图上控件数组
  },
  onLoad:function(options){
    // 1.页面初始化 options为页面跳转所带来的参数
    var that = this;
    // 2.调用wx.getLocation系统API,获取并设置当前位置经纬度
    this.timer = options.timer;// 1.获取定时器，用于判断是否已经在计费
   
    that.getLocationShow(that); //初始化地图坐标


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
    let markerId = e.markerId; // 获取点击的标记id
    let currMaker = _markers[markerId]; // 通过id,获取当前点击的标记
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
  bindregionchange: function (e) {
    console.log("9999")
    
    that.siteInfoList();
    // 拖动地图，获取附件洗衣机位置
    if (e.type == "begin") {
      var that = this;
      // that.siteInfoList();
      this.setData({
        // mark= res.data.data
      })
      // 停止拖动，显示单车位置
    } else if (e.type == "end") {
      this.setData({
        markers: this.data._markers
      })
    }
  },
  getLocationShow:function(that){
    wx.getLocation({
      // type: 'wgs84',
      type: 'gcj02',
      success: function (res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,

        })
        
        var data = {}
        data.appid = 'wxf79825c96701f981'; //appid
        var timestamp = Date.parse(new Date());//获取当前时间戳 
        data.timestamp = timestamp / 1000; 
        data.version = 1.0; //版本号
        data.sign = 'erwlkrjlkwjelrjwlke'; //签名
        data.latitude = res.latitude;  //纬度
        data.longitude = res.longitude; //经度
        data.rang = 10000;  //范围【单位米】
        wx.request({
          url: 'http://uat.kingxiyun.com/xiaoyou/site/siteManage/siteInfoList',
          data: data,
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            that.setData({
              county: res.data,
            })
            console.log(res)
          },
        })
      }
    })
  }



})
