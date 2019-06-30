const app = getApp()
Page({
  data:{
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onShow: function () {
    var that = this;
    var userId = app.globalData.userId;
    console.log(userId);
    wx.request({
      url: 'http://132.232.21.188:18080/v1/bb_risk/user/GetOverage/' + userId,
      success: function (res) {
        console.log(res.data)
        that.setData({
          userId: res.data
        })
      }
    })
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
      //console.log(app.globalData.userInfo)
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  //交易记录页面跳转
  goto1:function(res){
    wx.navigateTo({
      url: '../../pages/transactionRecord/transactionRecord',
    })
  },
  //常见问题页面跳转
  goto2:function(res){
    wx.navigateTo({
      url: '../../pages/FAQ/FAQ',
    })
  }
})