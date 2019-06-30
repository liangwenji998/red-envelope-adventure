// pages/successful/successful.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    taskId: null,
    height:0,
    userInfo:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    var that = this
    that.setData({
      taskId: options.taskId,
      userInfo: app.globalData.userInfo
    })
    var query = wx.createSelectorQuery();
    query.select('#top').boundingClientRect()
    query.exec(function (res) {
      var x = res[0].height
      wx.getSystemInfo({
        success: function (res) {
          that.setData({
            height: res.windowHeight - x,
          })
        }
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

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
  onShareAppMessage: function (res) {
    var that = this;
    console.log("任务id是：：：" + that.data.taskId)
    if (res.from == 'button') {
      return {
        title: '你有一个红包，请注意查收',
        path: '/pages/welcomepage/welcomepage?taskId=' + that.data.taskId +
        '&isShare=yes',
        success: function (res) {
          console.log("分享成功", res)
        }
      }
    }
  },
  //跳转到生成图片页面
  goto:function(res){
    wx.navigateTo({
      url: '../generate_image/generate_image',
    })
  }
})