// pages/searchList/searchList.js
var common = require("../../utils/util.js");

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		typeText: '',
		carId: '',
		c_id: '',
		list: [],
		info: {},
		share_image: '',
		share_title: '',
		shadeFlage: false
	},

	//获取车辆信息
	getCarInfo: function(text, id) {
		var that = this
		common.ajax({
			url: '',
			url: '/Home/Car/getSearchCarData',
			data: {
				number_type: text,
				number: id
			},
			success: res => {
				wx.hideLoading()
				if (res.status != 'ERROR') {
					that.setData({
						list: res.result.list,
						share_image: res.result.share_image,
						share_title: res.result.share_title
					})
				} else {
					that.setData({
						list: []
					})
					setTimeout(function() {
						wx.showToast({
							title: res.result.msg,
							icon: 'none',
							duration: 1500
						})
					}, 1)
				}
			}
		})
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		wx.showLoading({
			title: '加载中...'
		})
		this.setData({
			typeText: options.typeText,
			carId: options.carId
		})
		this.getCarInfo(this.data.typeText, this.data.carId)
	},
	onShow: function() {
		this.getCarInfo(this.data.typeText, this.data.carId)
	},

	/**
	 * 去验车
	 */
	toLookCar: function(e) {
		this.setData({
			shadeFlage: true,
			info: e.currentTarget.dataset.info
		})
	},

	/**
	 * 验车
	 */
	shadeSuccess: function() {
		wx.navigateTo({
			url: '../checkout/checkout?c_id=' + this.data.info.c_id,
		})
	},

	/**
	 * 关闭弹窗
	 */
	closeShade: function() {
		this.setData({
			shadeFlage: false,
		})
	},

	/**
	 * 阻止冒泡
	 */
	shadeFlag: function() {
		this.setData({
			shadeFlage: true,
		})
	},
	edit: function() {
		wx.navigateTo({
			url: '/pages/edit/edit?id=' + this.data.info.c_id
		})
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function() {

	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function() {
		this.setData({
			shadeFlage: false
		})
	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function() {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function() {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function() {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function() {
		var that = this
		return {
			title: that.data.share_title,
			imageUrl: that.data.share_image,
			path: 'pages/checkout/checkout?c_id=' + that.data.info.c_id,
			success: function(r) {
				wx.navigateTo({
					url: '../checkout/checkout?c_id=' + that.data.info.c_id,
				})
			},
			fail: function(r) {
				wx.showToast({
					title: '转发失败',
					icon: 'none',
					duration: 1500
				})
			}
		}
	}
})
