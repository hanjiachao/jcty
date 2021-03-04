//app.js
var common = require("utils/util.js");

App({
  getOpenid: function (userinfo) {
    var that = this
    wx.login({
      success: res => {
        common.ajax({
          url: '/Home/Login/getOpenid',
          data: { code: res.code },
          success: res => {
            if (res.status == 'SUCCESS') {
              that.globalData.openid = res.result.openid;
              if (res.result.access_token) {
                common.setUserinfo(res.result)
                that.globalData.userInfoFlag = false
                if (wx.getStorageSync("url")){
                  common.redirect_to(wx.getStorageSync("url"))
                }
              } else {
                common.ajax({
                  url: '/Home/Login/wxRegister',
                  data: {
                    openid: res.result.openid,
                    nickname: userinfo.nickName,
                    headimg: userinfo.avatarUrl
                  },
                  success: r => {
                    console.log(r)
                    if (r.status == 'ERROR') {
                      wx.showToast({
                        title: r.result.msg,
                        icon: 'none',
                        duration: 2000
                      })
                    } else {
                      var userInfo = userinfo
                      userInfo.access_token = r.result.access_token
                      common.setUserinfo(userInfo)
                      if (wx.getStorageSync("url")) {
                        common.redirect_to(wx.getStorageSync("url"))
                      }
                      that.globalData.userInfoFlag = false
                    }
                  }
                })
              }
            }
          }
        })
      },
      fail: res => {
        wx.showToast({
          title: '登录失败，请重试！',
          icon: 'none'
        })
      }
    })
  },
  onLaunch: function (options) {
    // 获取新版本更新
    common.upDate()
    this.globalData.userInfoFlag = (common.getUserinfo() ? false : true);
  },
  globalData: {
    userInfo: null,
    openid: '',
    userInfoFlag: true
  }
})