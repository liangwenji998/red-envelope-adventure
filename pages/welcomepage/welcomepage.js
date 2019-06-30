//获得app实例
const app = getApp();
Page({
  data: {
    headPortrait: '',
    nickname: '',
    nextPage: null
  },

  /**
   * 开始冒险按钮
   */
  enter: function(res){
    var that = this;
    if (res.detail.errMsg.match("ok")){
      //获取权限成功
      //存储用户信息到全局变量
      app.globalData.userInfo = res.detail.userInfo;
      //获取用户code调用登录接口
      wx.login({
        success: function(loginRes){
          //创建登录api所需的dto
          var userInfoDto = {};
          userInfoDto.code = loginRes.code;
          userInfoDto.headPortrait = res.detail.userInfo.avatarUrl;
          userInfoDto.nickname = res.detail.userInfo.nickName;

          //显示登录等待状态
          wx.showLoading({
            title: '正在进入',
            mask: true
          })

          //调用登录api登录
          wx.request({
            url: 'http://132.232.21.188:18080/v1/bb_risk/user/login',
            method: 'post',
            data: userInfoDto,
            success: function(myLoginRes) {
              //将用户id放入全局数据
              app.globalData.userId = myLoginRes.data

              //隐藏等待提示
              wx.hideLoading();

              //页面跳转
              console.log("跳转到" + that.data.nextPage)
              if (that.data.nextPage) {
                wx.redirectTo({
                  url: that.data.nextPage,
                })
              }else {
                wx.switchTab({
                  url: '../homepage/homepage',
                })
              }
            },
            fail: function() {
              //隐藏等待提示
              wx.hideLoading();

              //提示错误信息
              wx.showToast({
                title: '进入失败',
                icon: fail
              })
            }
          })
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this
    var height3 = ''//三分之一高
    var width3 = ''//三分之一宽
    var button = ''//按钮的高度
    var distance = ''//移动距离
    wx.getSystemInfo({
      success: function (res) {
        var height = res.screenHeight;
        var width = res.screenWidth;
        that.setData({
          height3: height / 3,
          width3: (width - height3) / 4,
          button: height - 200,
          distance: width - width3 / 2
        })
      },
    })
    var abc = wx.createAnimation({
      duration: 600,
      timingFunction: 'ease',
    })
    this.abc = abc
    this.setData({
      abcData: abc.export()
    })
    setTimeout(function () {
      abc.translateX(that.data.distance).step()
      this.setData({
        abcData: abc.export()
      })
    }.bind(this), 100)
    
    //处理进入方式
    if (options.isShare == 'yes'){
      var nextPage = '../shaomajinru/shaomajinru?taskId=' + options.taskId
      that.setData({
        nextPage: nextPage
      })
    }
  },
})