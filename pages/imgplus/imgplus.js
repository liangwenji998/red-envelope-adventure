// pages/imgplus/imgplus.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageUrl: null, //图片地址
    note: null //文字描述
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var imageUrlFirst = options.imageUrlFirst;
    var imageUrlLast = options.imageUrlLast;
    var imageUrl = "/" + imageUrlFirst + "/" + imageUrlLast
    that.setData({
      imageUrl: imageUrl,
      note: options.note
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
  onShareAppMessage: function () {

  }
})