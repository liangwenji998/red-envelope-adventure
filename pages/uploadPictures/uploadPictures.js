// pages/uploadPictures/uploadPictures.js
//上传照片页面
const app = getApp()

Page({
  data:{
    title:'',
    img:'',
    open: 1,
    map:'mapFalse',
    query: false, //判断是否有图片
    text:'',
    taskId:''
  },
  //初始化
  onLoad:function(option){
    var taskId = option.taskId //获取任务id
    this.setData({
      taskId: taskId
    })
    this.mission('调用获取任务情况方法')
    var that = this
    //初始化图片效果
    var img = that.data.img
    var http = 'https://www.easyicon.net/api/resizeApi.php?id=1202658&size=128'
    that.setData({
      img:http
    })
    //初始化公开效果
    var map = that.data.map
    var open = that.data.open
    that.animation = wx.createAnimation({
      duration: '100'
    })
    //设置滑动按钮初始位置
    var systemInfo = wx.getSystemInfoSync();
    that.animation.translate(70 / 750 * systemInfo.windowWidth, 0).step()
    that.setData({
      animation: that.animation.export(),
      open: 1,
      map: 'map',
    })
  },
  //获取任务情况
  mission:function(){
    var that = this
    wx.request({
      url: 'http://132.232.21.188:18080/v1/bb_risk/task/findTaskInfo?taskId=' + that.data.taskId,
      success:function(e){
        var title = that.data.title
        var a = e.data
        that.setData({
          title:a
        })
      }
    })
  },
  //没有图片提交的提示框
  hint:function(){  
    wx.showModal({
      title: '提示',
      content: '请添加图片',
    })
  },
  //清除图片
  cencel:function(){
    var that = this
    var img = that.data.img
    var http = 'https://www.easyicon.net/api/resizeApi.php?id=1202658&size=128'
    var query = that.data.query
    that.setData({
      img: http,
      query:false
    })
  },
  //上传图片
  add:function(){
    var that = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        var img = that.data.img
        var query = that.data.query
        that.setData({
          img: tempFilePaths,
          query:true
        })
      }
    })
  },
  //获取输入框内容
  getWords(e){
    var text = this.data.text
    this.setData({
      text: e.detail.value
    })
  },
  //是否公开选项
  choose:function(){
    //添加动画，动画播放速度
    var that = this
    that.animation = wx.createAnimation({
      duration: '100'
    })
    var open = that.data.open
    var map = that.data.map
    var systemInfo = wx.getSystemInfoSync();
    //判断是否公开照片
    if(open == 1){
      that.animation.translate(0 / 750 * systemInfo.windowWidth, 0).step()
      that.setData({
        animation: that.animation.export(),
        open:0,
        map:'mapFalse'
      })
    }else{
      that.animation.translate(70 / 750 * systemInfo.windowWidth, 0).step()
      that.setData({
        animation: that.animation.export(),
        open:1,
        map:'map',
      })
    }
  },

  //上传事件
  upload:function(){
    var that = this
    var json = {
      isPublic: that.data.open,
      note:that.data.text,
      taskId:that.data.taskId,
      userId: app.globalData.userId
    };
    //上传提示框
    var image = that.data.img[0]
    wx.showToast({
      title: '上传中...',
      icon: 'loading',
      duration: 21000
    })
    //上传
    wx.uploadFile({
      url:'http://132.232.21.188:18080/v1/bb_risk/partner/joinGame',
      filePath:image,
      name: 'image',
      formData: json,
      success:function(e){
        if (e.data == 'success'){
          //上传成功弹窗
          wx.showToast({
            title: '成功',
            icon: 'succes',
            duration: 1000,
            mask: true
          })
          setTimeout(function () {
            wx.redirectTo({
              url: '../shaomajinru/shaomajinru?taskId=' + that.data.taskId,
            })
            wx.hideToast()
          }, 1500)
        }else{
          //图片错误弹窗
          wx.showModal({
            title: '提示',
            content: e.data,
          })
          setTimeout(function () {
            wx.hideToast()
          }, 2000)
        }
      },
      //网络请求错误提示框
      fail:function(){
        wx.showModal({
          title: '提示',
          content: '网络请求超时！！',
        })
      }
    })
  }
})