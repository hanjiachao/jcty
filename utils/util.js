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

//电话号码判断
function isMobile(mobile) {
  return /^1[3456789]\d{9}$/.test(mobile)
}

//身份证号码判断
function isIdCard(value) {
  var format = /^(([1][1-5])|([2][1-3])|([3][1-7])|([4][1-6])|([5][0-4])|([6][1-5])|([7][1])|([8][1-2]))\d{4}(([1][9]\d{2})|([2]\d{3}))(([0][1-9])|([1][0-2]))(([0][1-9])|([1-2][0-9])|([3][0-1]))\d{3}[0-9xX]$/;
  //号码规则校验
  if(!format.test(value)){
    return false
  }
  //区位码校验
  //出生年月日校验   前正则限制起始年份为1900;
  var year = value.substr(6,4),
      month = value.substr(10,2),
      date = value.substr(12,2),
      time = Date.parse(month + '-' + date + '-' + year),
      nowTime = Date.parse(new Date()),
      dates = (new Date(year,month,0)).getDate();
  if(time > nowTime || date > dates){
    return false
  }
  //校验码判断
  var c = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);   //系数
  var b = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');  //校验码对照表
  var id_array = value.split("");
  var sum = 0;
  for(var k = 0;k < 17;k++){
    sum += parseInt(id_array[k]) * parseInt(c[k]);
  }
  if(id_array[17].toUpperCase() != b[sum % 11].toUpperCase()){
    return false
  }
  return true
}

//将秒转化为时分秒
function formateSeconds(endTime) {
  let result = parseInt(endTime)
  let h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600)
  let m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60))
  let s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60))
  result = `${h}:${m}:${s}`
  return result
}

//请求域名
// var appUrl = 'http://wllyxcx.haozhicheng.weyoui.cn/index.php'
var appUrl = 'https://xcx.tuoyun123.cn/index.php'

//提示信息弹窗
function message(msg, callback) {
  wx.showToast({
    title: msg,
    icon: 'none',
    duration: 3000
  })
  callback()
}

//设置用户信息
function setUserinfo(userinfo) {
  try {
    if (userinfo) {
      var expireTime = new Date().getTime() + 86400000 * 7;
      userinfo.expireTime = expireTime;
      wx.setStorageSync('userinfo', JSON.stringify(userinfo))
    } else {
      wx.clearStorageSync('userinfo')
    }
  } catch (res) {
    return false
  }
}

//获取用户信息
function getUserinfo() {
  try {
    var userinfo = wx.getStorageSync('userinfo')
    userinfo = JSON.parse(userinfo)
    var nowTime = new Date().getTime();
    if (userinfo.expireTime < nowTime) {
      return false
    } else {
      return userinfo
    }
  } catch (res) {
    return false
  }
}

//快速点击
function throttle(fun, gapTime) {
  if (gapTime == null || gapTime == undefined) {
    gapTime = 1500
  }
  let lastTime = null
  return function () {
    let nowTime = + new Date()
    if (nowTime - lastTime > gapTime || !lastTime) {
      fun.apply(this, arguments)
      lastTime = nowTime
    } else {
      wx.showToast({
        title: '您点击太频繁了，请稍候！',
        icon: 'none',
        duration: 2000
      })
    }
  }
}

//不需要登录注册，默认使用微信授权登录
function login(openid, userInfo, share_code) {
  ajax({
    url: 'Home/Login/wxRegister',
    loading: '登录中......',
    data: {
      openid: openid,
      nickname: userInfo.nickName,
      headimg: userInfo.avatarUrl,
      share_code: share_code
    },
    success: function (res) {
      setUserinfo(res.result)
      wx.switchTab({
        url: '/pages/index/index'
      })
    }
  })
}

//需要登录注册
function logins(router, openid, share_code) {
  //跳转登录页面
  wx.redirectTo({
    url: router + '?openid=' + openid + '&share_code=' + share_code,
  })
}

function redirect_to(router) {
  var tbar_list = [] //tabBar页面路径
  if (tbar_list.indexOf(router) >= 0) {
    wx.switchTab({
      url: '/' + router
    })
  } else {
    wx.redirectTo({
      url: '/' + router
    })
  }
}

//记录当前页面
function getUrl() {
  var pages = getCurrentPages()
  var currentPage = pages[pages.length - 1]
  var url = currentPage.route
  var options = currentPage.options
  var path = url + '?'
  for (var key in options) {
    var value = options[key]
    path += key + '=' + value + '&'
  }
  path = path.substring(0, path.length - 1)
  wx.setStorageSync('url', path)
}

function sendAjax(date) {
  if (!date.url) {
    message('缺少地址')
    return false
  }
  if (date.loading) {
    wx.showLoading({
      title: date.loading,
    })
  }
  var time, timeEnd = 5000
  if (!date.filePath) {
    var request = wx.request({
      //HTTPS网络请求
      url: appUrl + date.url,
      data: date.data ? date.data : {},
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: date.type ? date.type : 'POST',
      success: function (res) {
        if (res.statusCode == 200) {
          if (res.data.errorCode == '100008') {
            message('您的登录信息已失效', function () {
              setUserinfo(null)
              date.userinfo = true
              ajax(date)
            })
          } else {
            if (date.success) {
              date.success(res.data)
            }
          }
        } else {
          if (data.fail) {
            date.fail(res)
          }
        }
      },
      fail: function (res) {
        if (date.fail) {
          date.fail(res)
        }
      },
      complete: function (res) {
        clearTimeout(time)
        if (date.loading) {
          wx.hideLoading()
        }
      },
    })
  } else {
    timeEnd = 30000
    var request = wx.uploadFile({
      //上传文件到服务器
      url: appUrl + date.url,
      filePath: date.filePath,
      name: date.name,
      formData: date.formData ? date.formData : {},
      success: function (res) {
        if (res.statusCode == 200) {
          if (res.data.errorCode == '100008') {
            message('您的登录信息已失效', function () {
              setUserinfo(null)
              date.userinfo = true
              ajax(date)
            })
          } else {
            if (date.success) {
              date.success(res.data)
            }
          }
        } else {
          if (data.fail) {
            date.fail(res)
          }
        }
      },
      fail: function (res) {
        if (date.fail) {
          date.fail(res)
        }
      },
      complete: function (res) {
        clearTimeout(time)
        if (date.loading) {
          wx.hideLoading()
        }
      }
    })
  }
  //网络超时，中断请求
  time = setTimeout(function () {
    if (date.loading) {
      wx.hideLoading()
      message('网络通讯故障，请重试')
    }
    request.abort()
  }, timeEnd)
}

//ajax请求
function ajax(date) {
  if (date.userinfo) {
    wx.getStorage({
      key: 'userinfo',
      success: function (res) {
        if (date.formData){
          date.formData.access_token = JSON.parse(res.data).access_token
        }else{
          if (!date.data) {
            date.data = {}
          }
          date.data.access_token = JSON.parse(res.data).access_token
        }
        sendAjax(date)
      },
      fail: function (res) {
        getUrl()
        wx.showModal({
          title: '提示',
          content: '您的授权信息有误，请前去授权！',
          showCancel: true,
          cancelText: '取消',
          success(res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '/pages/index/index',
              })
            }
          }
        })
      }
    })
  } else {
    sendAjax(date)
  }
}

//更新版本
function upDate () {
  if (wx.canIUse('getUpdateManager')) {
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
      if (res.hasUpdate) {
        updateManager.onUpdateReady(function () {
          wx.showModal({
            title: '更新提示',
            content: '新版本已经准备好，是否重启应用？',
            success: function (res) {
              if (res.confirm) {
                updateManager.applyUpdate()
              }
            }
          })
        })
        updateManager.onUpdateFailed(function () {
          wx.showModal({
            title: '已经有新版本了哟~',
            content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
          })
        })
      }
    })
  } else {
    wx.showModal({
      title: '提示',
      content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
    })
  }
}

//获取位置
function location(callback) {
  wx.getLocation({
    type: 'gcj02',
    success: function (res) {
      callback(res)
    }
  })
}

module.exports = {
  formatTime: formatTime,
  isMobile: isMobile,
  isIdCard: isIdCard,
  formateSeconds: formateSeconds,
  appUrl: appUrl,
  setUserinfo: setUserinfo,
  getUserinfo: getUserinfo,
  throttle: throttle,
  ajax: ajax,
  login: login,
  logins: logins,
  upDate: upDate,
  getUrl: getUrl,
  redirect_to: redirect_to,
  location: location
}