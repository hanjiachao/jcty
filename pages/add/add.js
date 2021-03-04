// pages/add/add.js
var common = require("../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    typeArr: ['车牌','临牌','车架号（后六位）'],
    typeText: '',
    carId: '',
    carInfo: '',
    start: '',
    end: '',
    c_id: '',
    share_image: '',
    share_title: '',
    shaerFlage: false
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
   * 获取车辆信息
   */
  getCarInfo: function (e) {
    var that = this
    that.setData({
      carInfo: e.detail.value
    })
  },

  /**
   * 获取起始地
   */
  getStart: function (e) { 
    var that = this
    that.setData({
      start: e.detail.value
    })
  },
  
  /**
   * 获取到达地
   */
  getEnd: function (e) {
    var that = this
    that.setData({
      end: e.detail.value
    })
   },

   /**
    * 提交信息
    */
  submitInfo: function () {
    var that = this
	if(that.data.typeText == '' && that.data.carId != ''){
	  wx.showToast({
	    title: '请选择车牌/临牌/车架号（三选一）',
	    icon: 'none',
	    duration: 1500
	  })
	  return false
	}
    if(that.data.carInfo == ''){
      wx.showToast({
        title: '请输入车辆名称',
        icon: 'none',
        duration: 1500
      })
      return false
    }
    if (that.data.start == '') {
      wx.showToast({
        title: '请输入起始地',
        icon: 'none',
        duration: 1500
      })
      return false
    }
    if (that.data.end == '') {
      wx.showToast({
        title: '请输入到达地',
        icon: 'none',
        duration: 1500
      })
      return false
    }
    common.ajax({
      url: '/Home/Car/addCarData',
      loading: '加载中...',
      // userinfo: true,
      data: {
        number_type: that.data.typeText,
        number: that.data.carId,
        name: that.data.carInfo,
        start_address: that.data.start,
        end_address: that.data.end
      },
      success: res => {
        that.setData({
          c_id: res.result.c_id,
          share_image: res.result.share_image,
          share_title: res.result.share_title,
          shaerFlage: true
        })
      }
    })
  },

  /**
   * 取消
   */
  operationClose: function () {
    this.setData({
      shaerFlage: false
    })
    wx.navigateTo({
      url: '../checkout/checkout?c_id=' + this.data.c_id,
    })
  },
  closeFrame: function(){
	  this.setData({
	    shaerFlage: false
	  })
  },

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
  onShareAppMessage: function (res) {
	  // 天津到上海别克	GL8津QA8888
    var that = this
    return {
      title: that.data.share_title,
      imageUrl: that.data.share_image,
      path: 'pages/checkout/checkout?c_id=' + that.data.c_id,
      success: function (r) {
        wx.navigateTo({
          url: '../checkout/checkout?c_id=' + that.data.c_id,
        })
      },
      fail: function (r) {
        wx.showToast({
          title: '转发失败',
          icon: 'none',
          duration: 1500
        })
      }
    }
  }
})