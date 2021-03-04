//index.js
var common = require("../../utils/util.js");
const app = getApp()

Page({
  data: {
    userInfoFlag: true
  },

  /**
   * 点击微信授权
   */
  bindGetUserInfo: function (e) {
    var that = this;
    var wxUserinfo = e.detail.userInfo
    that.setData({
      userInfoFlag: false
    })
    if (wxUserinfo) {
      getApp().getOpenid(wxUserinfo)
    } else {
      wx.showModal({
        title: '温馨提示',
        content: '您点击了拒绝授权，\n将无法使用小程序的一些功能，\n请授权之后再进入!!!',
        confirmText: '返回授权',
        cancelText: '取消',
        success: function (res) {
          if (res.confirm) {
            wx.openSetting({
              success: function(data){
                if (data){
                  if (data.authSetting["scope.userInfo"] == true){
                    wx.getUserInfo({
                      withCredentials: false,
                      success: function (data){
                        let info = data.userInfo
                        getApp().getOpenid(info)
                      }
                    })
                  }
                }
              }
            })
          }
        }
      })
    }
  },

  /**
   * 新增验车
   */
  toAdd: common.throttle(function(){
    wx.navigateTo({
      url: '../add/add',
    })
  },1000),

  /**
   * 我要查找
   */
  toSearch: common.throttle(function () {
    wx.navigateTo({
      url: '../search/search',
    })
  }, 1000),

  onShow: function () {
    this.setData({
      userInfoFlag: getApp().globalData.userInfoFlag
    })
  },

  onLoad: function () {
    
  }
})
