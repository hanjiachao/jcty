// pages/search/search.js
var common = require("../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    typeArr: ['车牌', '临牌', '车架号（后六位）'],
    typeText: '',
    carId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 选择车辆信息类型
   */
  bindPickerChange: function (e) {
    var that = this
    that.setData({
      typeText: that.data.typeArr[e.detail.value]
    })
  },

  /**
   * 获取车辆车牌/临牌/车架号
   */
  getCarId: function (e) {
    var that = this
    that.setData({
      carId: e.detail.value
    })
  },

  /**
   * 下一步搜索
   */
  submitSearch: common.throttle(function () {
    var that = this
    if(that.data.typeText == ''){
      wx.showToast({
        title: '请选择识别类型',
        icon: 'none',
        duration: 1500
      })
      return false
    }
    if (that.data.carId == '') {
      wx.showToast({
        title: '请输入车牌/临牌/车架号',
        icon: 'none',
        duration: 1500
      })
      return false
    }
    common.ajax({
      url: '',
      url: '/Home/Car/getSearchCarData',
      loading: '加载中...',
      data: {
        number_type: that.data.typeText,
        number: that.data.carId
      },
      success: res => {
        if (res.status != 'ERROR'){
          wx.navigateTo({
            url: '../searchList/searchList?typeText=' + that.data.typeText + '&carId=' + that.data.carId,
          })
        }else{
          setTimeout(function(){
            wx.showToast({
              title: res.result.msg,
              icon: 'none',
              duration: 1500
            })
          },1)
        }
      }
    })
  }, 1000),

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})