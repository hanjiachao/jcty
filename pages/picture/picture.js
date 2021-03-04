// pages/picture/picture.js
var common = require("../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    c_id: '',
    info: {},
	shareTitle: '',
	shareImg: '',
    list0: [],
    list1: [],
    list2: [],
    list3: [],
    list4: [],
    list5: [],
	list6: [],
    imagesPress: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      c_id: options.c_id
    })
    this.getCarFileData(this.data.c_id)
  },

  /**
   * 获取车辆信息
   */
  getCarFileData: function (id) {
    var that = this
    common.ajax({
      url: '/Home/Car/getCarFileData',
      loading: '加载中...',
      data: {
        c_id: id,
        type: '照片'
      },
      success: res => {
        that.setData({
          info: res.result.car,
		  shareTitle: res.result.share_title,
		  shareImg: res.result.share_image,
          list0: res.result.first_list,
          list1: res.result.fifth_list,
          list2: res.result.second_list,
          list3: res.result.third_list,
          list4: res.result.sixth_list,
          list5: res.result.fourth_list,
		  list6: res.result.seventh_list
        })
      }
    })
  },

  //上传验车照片
  upload: function (id, type, idx) {
    var that = this
    if (that.data.imgFlag) {
      return false
    }
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        const tempFilePaths = res.tempFiles
        // for (var i = 0; i < tempFilePaths.length; i++) {
        //   if (tempFilePaths[i].size >= 3145728) {
        //     console.log('请上传3M以内的图片');
        //     return;
        //   }
        // }
        that.getCanvasImg(0, 0, tempFilePaths, function (res) {
          common.ajax({
            url: '/Home/Car/addUploadsFile',
            loading: '上传中...',
            filePath: res,
            name: 'file',
            // userinfo: true,
            formData: {
              c_id: id,
              file_type: '照片',
              file_cate: type
            },
            success: res => {
              var urlList = 'list' + idx
              var list = that.data['list' + idx]
              list.push({
                cf_file: JSON.parse(res).result.fileUrl,
                time: JSON.parse(res).result.time
              })
              that.setData({
                [urlList]: list
              })
            },
            fail: res => {
              wx.showToast({
                title: '上传失败，请重试！',
                icon: 'none',
                duration: 3000
              })
            }
          })
        })
      }
    })
  },

  /**
   * 图片预览
   */
  imgLook: function (e) {
    wx.previewImage({
      current: e.currentTarget.dataset.url,
      urls: [e.currentTarget.dataset.url]
    })
  },

  /**
   * 上传行驶证/车架号/临牌照片
   */
  uploadImg: function (e) {
    var typeList = [
		'行驶证/车架号/临牌照片',
		'公里数照片',
		'原车损伤照片',
		'随车物品照片',
		'中转地里程表照片',
		'新增损伤照片',
		'中转地新增随车物品照片'
	]
    var index = e.currentTarget.dataset.idx
    this.upload(this.data.c_id, typeList[index], index)
  },

  /**
   * 验车完成
   */
  submitComplete: function () {
	  // wx.navigateBack()
	  wx.reLaunch({
		  url: '../add/add'
	  })
    // var that = this
    // wx.navigateTo({
    //   url: '../index/index',
    // })
    // wx.showModal({
    //   title: '提示',
    //   content: '验车完成之后不可再\n新增验车视频，\n是否确定验车完成？',
    //   showCancel: true,
    //   cancelText: '取消',
    //   success(res) {
    //     if (res.confirm) {
    //       common.ajax({
    //         url: '/Home/Car/updateCheckCarStatus',
    //         loading: '加载中...',
    //         // userinfo: true,
    //         data: {
    //           c_id: that.data.c_id
    //         },
    //         success: res => {
    //           wx.showToast({
    //             title: '该订单已完成验车了!',
    //             icon: 'success',
    //             duration: 1500
    //           })
    //           setTimeout(function () {
    //             wx.redirectTo({
    //               url: '../index/index',
    //             })
    //           }, 1000)
    //         }
    //       })
    //     }
    //   }
    // })
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
   * 图片压缩
   */
  compress: function (imgFile, size, callback) {
    let that = this;
    const ctx = wx.createCanvasContext('attendCanvasId');
    wx.getImageInfo({
      src: imgFile,
      success: function (res) {
        if (size > 1000000) {//判断图片是否超过1M
          //获取原图比例
          let scale = res.width / res.height
          if (res.width > res.height) {
            that.setData({//构造画板宽高
              canWidth: 500,
              canHeight: 500 / scale
            })
          } else {
            that.setData({//构造画板宽高
              canHeight: 500,
              canWidth: 500 * scale
            })
          }
          //----------绘制图形并取出图片路径--------------
          ctx.drawImage(imgFile, 0, 0, that.data.canWidth, that.data.canHeight)
          ctx.draw(false, function () {
            wx.canvasToTempFilePath({
              canvasId: 'attendCanvasId',
              width: that.data.canWidth,
              height: that.data.canHeight,
              success: function (res) {
                callback(res.tempFilePath)//最终图片路径
              },
              fail: function (res) {
                console.log(res.errMsg)
              }
            })
          })
        } else {
          callback(res.path)
        }
      }
    })
  },

  /**
   * 多张图片压缩 压缩并获取图片，这里用了递归的方法来解决canvas的draw方法延时的问题
   */
  getCanvasImg: function (index, failNum, tempFilePaths, callback) {
    var that = this;
    let imagesPress = that.data.imagesPress;
    if (index < tempFilePaths.length) {
      wx.getImageInfo({
        src: tempFilePaths[index].path,
        success: function (res) {
          // if (tempFilePaths[index].size > 1000000) {//判断图片是否超过1M
		  if (false) {
            //---------利用canvas压缩图片--------------
            //获取原图比例
            let scale = res.width / res.height
            if (res.width > res.height) {
              that.setData({//构造画板宽高
                canWidth: 500,
                canHeight: 500 / scale
              })
            } else {
              that.setData({//构造画板宽高
                canHeight: 500,
                canWidth: 500 * scale
              })
            }
            const ctx = wx.createCanvasContext('attendCanvasId');
            ctx.drawImage(tempFilePaths[index], 0, 0, canvasWidth, canvasHeight);
            ctx.draw(false, function () {
              index = index + 1;//上传成功的数量，上传成功则加1
              wx.canvasToTempFilePath({
                canvasId: 'attendCanvasId',
                success: function success(res) {
                  console.log('最终图片路径' + res.tempFilePath)//最终图片路径
                  imagesPress.push(res.tempFilePath);
                  console.log(that.data.imagesPress)
                  that.setData({
                    imagesPress: imagesPress
                  })
                  callback(res.tempFilePath)
                  console.log('第' + index + '张')
                  console.log(res.tempFilePath)
                  that.getCanvasImg(index, failNum, tempFilePaths, callback);
                }, fail: function (e) {
                  failNum += 1;//失败数量，可以用来提示用户
                  that.getCanvasImg(inedx, failNum, tempFilePaths, callback);
                }
              });
            });
          } else {
            index = index + 1;
            callback(res.path)
            that.getCanvasImg(index, failNum, tempFilePaths, callback);
          }
        }
      })
    }
  },
  onShareAppMessage: function (res) {
    var that = this
    return {
      title: that.data.shareTitle,
      imageUrl: that.data.shareImg,
      path: 'pages/picture/picture?c_id=' + that.data.c_id
    }
  }
})