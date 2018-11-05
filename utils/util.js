const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//字节数组转十六进制字符串 
function Bytes2Str(arr) {     
  var str = "";     
  for(var i=0; i<arr.length; i++){        
    var tmp = arr[i].toString(16);       
    if(tmp.length == 1){            
      tmp = "0" + tmp;        
    }        
      str += tmp;     
  }     
    return str;
}

//十六进制字符串转字节数组
function Str2Bytes(str) { 
  var pos = 0; 
  var len = str.length; 
  if (len % 2 != 0) { 
    return null; 
  } 
    len /= 2;
    var hexA = new Array(); 
    for (var i = 0; i < len; i++) { 
       var s = str.substr(pos, 2); 
       var v = parseInt(s, 16); 
       hexA.push(v); pos += 2; 
       } 
       return hexA; 
}


function encryption(key,value){  //封装全局加密方法
  // console.log('明文：', key, value);
  var val = value;
  // console.log('明文：',val);
  var jsonstr = objKeySort(val);
  // console.log("排序后：",jsonstr);
  jsonstr = JSON.stringify(jsonstr);
  // console.log('对象转字符串后：',jsonstr);
  // console.log(typeof (jsonstr))
  val = jsonstr;
  var sha1 = require('js/sha1.js');
  var sha1Pw = sha1.HmacSHA1(val, key);  //sha1加密
  
  val = sha1Pw.toString();
  // console.log('sha1加密:', val);
  var md5 = require('js/md5.js');  //md5加密
  var md5Pw = md5.hexMD5(val);
  // console.log('md5加密:', md5Pw);

  return md5Pw;
}
//key值顺序排序的函数
function objKeySort(obj) {//排序的函数
  var newkey = Object.keys(obj).sort();
  //先用Object内置类的keys方法获取要排序对象的属性名，再利用Array原型上的sort方法对获取的属性名进行排序，newkey是一个数组
  var newObj = {};//创建一个新的对象，用于存放排好序的键值对
  for (var i = 0; i < newkey.length; i++) {//遍历newkey数组
    newObj[newkey[i]] = obj[newkey[i]];//向新创建的对象中按照排好的顺序依次增加键值对
  }
  return newObj;//返回排好序的新对象
}
//key值ASCII码从小到大排序（字典序）
function sort_ASCII(obj) {
  var arr = new Array();
  var num = 0;
  for (var i in obj) {
    arr[num] = i;
    num++;
  }
  var sortArr = arr.sort();
  var sortObj = {};
  for (var i in sortArr) {
    sortObj[sortArr[i]] = obj[sortArr[i]];
  }
  return sortObj;
}
function splicingString(obj){ //封装全局拼接微信支付验签字符串
  var str = '';
  var arr = Object.keys(obj);
  var j = arr.length;
  var k = 0;
  for (var i in obj) {
    k++;
    // console.log("aa.length::", j, k)
    if (j == k) {
      str += i + "=" + obj[i]
    } else {
      str += i + "=" + obj[i] + "&"
    }
    // console.log(i,'--',aa[i]);
  }
  return str;
  // console.log(str)
}
function getNum() { //随机生成32位随机数
  var chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']; 
  var nums = "";
  for (var i = 0; i < 32; i++) {
    var id = parseInt(Math.random() * 61); 
    nums += chars[id]; 
  } 
  return nums; 
}
function newDataTime(str) { //时间戳转年月日
  var date = new Date(str);
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? ('0' + m) : m;
  var d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  var h = date.getHours();
  h = h < 10 ? ('0' + h) : h;
  var minute = date.getMinutes();
  var second = date.getSeconds();
  minute = minute < 10 ? ('0' + minute) : minute;
  second = second < 10 ? ('0' + second) : second;
  var newDataTime = y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second; 
  return newDataTime;
}


module.exports = {
  formatTime: formatTime,
  // Bytes2Str: Bytes2Str,
  // Str2Bytes: Str2Bytes,
  encryption: encryption,
  getNum: getNum,
  objKeySort: objKeySort,
  sort_ASCII: sort_ASCII,
  splicingString: splicingString,
  newDataTime: newDataTime,
}

//util.js
function imageUtil(e) {
  var imageSize = {};
  var originalWidth = e.detail.width;//图片原始宽
  var originalHeight = e.detail.height;//图片原始高
  var originalScale = originalHeight / originalWidth;//图片高宽比
  // console.log('originalWidth: ' + originalWidth)
  // console.log('originalHeight: ' + originalHeight)
  //获取屏幕宽高
  wx.getSystemInfo({
    success: function (res) {
      var windowWidth = res.windowWidth/2-60;
      var windowHeight = res.windowHeight;
      // console.log("///////", windowWidth);
      var windowscale = windowHeight / windowWidth;//屏幕高宽比
      // console.log('windowWidth: ' + windowWidth)
      // console.log('windowHeight: ' + windowHeight)
      if (originalScale < windowscale) {//图片高宽比小于屏幕高宽比
        //图片缩放后的宽为屏幕宽
        imageSize.imageWidth = windowWidth;
        imageSize.imageHeight = (windowWidth * originalHeight) / originalWidth;
      } else {//图片高宽比大于屏幕高宽比
        //图片缩放后的高为屏幕高
        imageSize.imageHeight = windowHeight;
        imageSize.imageWidth = (windowHeight * originalWidth) / originalHeight;
      }

    }
  })
  // console.log('缩放后的宽: ' + imageSize.imageWidth)
  // console.log('缩放后的高: ' + imageSize.imageHeight)
  return imageSize;
}

module.exports.imageUtil = {
  imageUtil: imageUtil
}


function expImageUtil(e) {
  var imageSize = {};
  var originalWidth = e.detail.width;//图片原始宽
  var originalHeight = e.detail.height;//图片原始高
  var originalScale = originalHeight / originalWidth;//图片高宽比
  // console.log('originalWidth: ' + originalWidth)
  // console.log('originalHeight: ' + originalHeight)
  //获取屏幕宽高
  wx.getSystemInfo({
    success: function (res) {
      var windowWidth = res.windowWidth-30;
      var windowHeight = res.windowHeight;
      // console.log("///////", windowWidth);
      var windowscale = windowHeight / windowWidth;//屏幕高宽比
      // console.log('windowWidth: ' + windowWidth)
      // console.log('windowHeight: ' + windowHeight)
      if (originalScale < windowscale) {//图片高宽比小于屏幕高宽比
        //图片缩放后的宽为屏幕宽
        imageSize.imageWidth = windowWidth;
        imageSize.imageHeight = (windowWidth * originalHeight) / originalWidth;
      } else {//图片高宽比大于屏幕高宽比
        //图片缩放后的高为屏幕高
        imageSize.imageHeight = windowHeight;
        imageSize.imageWidth = (windowHeight * originalWidth) / originalHeight;
      }

    }
  })
  // console.log('缩放后的宽: ' + imageSize.imageWidth)
  // console.log('缩放后的高: ' + imageSize.imageHeight)
  return imageSize;
}
module.exports.expImageUtil = {
  expImageUtil: expImageUtil
}