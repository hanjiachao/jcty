// pages/checkout/checkout.js
var common = require("../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    c_id: '',
    typeArr: ['车牌', '临牌', '车架号（后六位）'],
    typeText: '',
    carId: '',
    info: {
      c_end_address: "新增测试6",
      c_id: "13",
      c_name: "新增测试6",
      c_number: "",
      c_number_type: "",
      c_start_address: "新增测试6",
      c_status: "normal",
    },
	shareTitle: '',
	shareImg: '',
	focus: false
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      c_id: options.c_id
    })
    this.getCarInfo(this.data.c_id)
  },
  
  bindfocus: function(){
	  this.setData({
		  focus: true
	  })
  },
  bindblur: function(){
  	  this.setData({
		  focus: false
  	  })
  },
  changeFocus: function(){
	  let focus = this.data.focus
	  this.setData({
		  focus: !focus
	  })
	  if(focus && this.data.carId){
		  this.completionInfo()
	  }
  },
  
  /**
   * 获取车辆信息
   */
  getCarInfo: function (id) {
    var that = this
    common.ajax({
      url: '/Home/Car/getCarData',
      loading: '加载中...',
      data: {
        c_id: id
      },
      success: res=> {
        that.setData({
          info: res.result.list,
		  shareTitle: res.result.share_title,
		  shareImg: res.result.image
        })
      }
    })
  },

  /**
   * 补全车辆信息
   */
  completionInfo: function (type) {
    var that = this
    if (that.data.typeText == '') {
      wx.showToast({
        title: '请选择输入类型',
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
      url: '/Home/Car/supplementCarData',
      // userinfo: true,
      data: {
        c_id: that.data.c_id,
        number: that.data.carId,
        number_type: that.data.typeText
      },
      success: res => {
        if(type == '拍照'){
          wx.navigateTo({
            url: '../picture/picture?c_id=' + that.data.c_id,
          })
        }else if(type == '视频'){
          wx.navigateTo({
            url: '../video/video?c_id=' + that.data.c_id,
          })
        }else{
			this.getCarInfo(this.data.c_id)
		}
      }
    })
  },

  /**
   * 拍照
   */
  photograph: common.throttle(function () {
    var that = this
    if (that.data.info.c_number_type != '') {
      wx.navigateTo({
        url: '../picture/picture?c_id=' + that.data.c_id,
      })
    } else {
      that.completionInfo('拍照')
    }
  }, 1000),

  /**
   * 视频
   */
  videoShoot: common.throttle(function () {
    var that = this
    if (that.data.info.c_number_type != '') {
      wx.navigateTo({
        url: '../video/video?c_id=' + that.data.c_id,
      })
    }else{
      that.completionInfo('视频')
    }
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
  onShareAppMessage: function (res) {
    var that = this
    return {
      title: that.data.shareTitle,
      imageUrl: that.data.shareImg,
      path: 'pages/checkout/checkout?c_id=' + that.data.c_id
    }
  }
})