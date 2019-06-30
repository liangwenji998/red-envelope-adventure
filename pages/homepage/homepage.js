var height=''//
var width=''//设备信息
Page({
  data: {

  },
  onLoad: function (options) {
    var that=this
    //获取设备信息
    wx.getSystemInfo({
      success: function(res) {
        height =res.screenHeight;
        width = res.screenWidth
      },
    })
    var query=wx.createSelectorQuery()
    var dis=''
    query.select("#mjltest").boundingClientRect()
    query.exec(function(res){
      that.setData({
        dis: res[0].width
      })
    })
    var distance = (width - dis) / 2 + dis
    // 动画二
    var abc = wx.createAnimation({
      duration: 1000,//时间
      timingFunction: 'ease',//动画的效果
    })
    this.abc = abc
    this.setData({
      abcData: abc.export()
    })
    setTimeout(function () {
      console.log(distance)
      abc.translateX(Number(distance)).step()
      this.setData({
        abcData: abc.export()
      })
    }.bind(this), 100)
  },
  //跳转到发布任务界面
  goto:function(res){
    wx.navigateTo({
      url: '../../pages/homepage/fabu/fabu',
    })
  }
})
