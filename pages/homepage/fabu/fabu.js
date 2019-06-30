//获取实例
const app = getApp()
Page({
  data: {
    yaoqiu:'',
    jine:0,
    shuliang:0,
    userInfo:''
  },

  // 任务要求监听
  yaoqiu: function (e) {
    this.setData({
      yaoqiu: e.detail.value
    })
  },

  // 总赏金监听
  jine: function (e) {
    var zongjine = parseInt(e.detail.value)
    this.setData({
      jine: zongjine
    })
  },

  // 红包数监听
  shuliang: function (e) {
    var hongbaoshu = parseInt(e.detail.value)
    this.setData({
      shuliang: hongbaoshu
    })
  },

  //跳转 
  jump:function(){
    var that = this;
    // 判断任务要求是否为空且长度小于24
    if (that.data.yaoqiu != '' && that.data.yaoqiu.length <= 24) {
      // 判断总赏金数额
      if (that.data.jine > 0 && that.data.jine <= 200) {
        // 判断红包数数额
        if (that.data.shuliang > 0 && that.data.shuliang <= 100) {
          // 显示模态对话框
          wx.showModal({
            title: '确认发布',
            content: '是否确认发布任务',
            success(res){
              //定义任务id(全局变量)
              var taskId;
              // 判断用户是否点击确认
              if (res.confirm) {

                //定义json对象，将本地的数据赋给json对象
                var json = {};
                console.log(that.data)

                //将本地的数据赋给后台
                json.claim = that.data.yaoqiu
                json.totalBounty = that.data.jine
                json.totalRed = that.data.shuliang
                json.userId = app.globalData.userId
                console.log(json)

                //发布任务接口
                wx.request({
                  url: 'http://132.232.21.188:18080/v1/bb_risk/task/creatTask',
                  method: 'post',
                  //将json对象赋给data
                  data: json,
                  success(res) {
                    console.log(res)
                    //获取任务id
                    taskId = res.data;
                  }
                })

                //显示模态对话框
                wx.showModal({
                  title: '确认支付',
                  content: '是否确认支付',
                  success(res) {
                    // 判断用户是否点击确认
                    if (res.confirm) {

                      //定义支付接口所需数据（局部变量）
                      let payJson = {};
                      // 将总赏金，任务id等赋给payJson对象
                      payJson.money = json.totalBounty;
                      payJson.taskId = taskId;
                      payJson.userId = app.globalData.userId;
                      console.log(payJson)

                      // 任务支付
                      wx.request({
                        url: 'http://132.232.21.188:18080/v1/bb_risk/user/pay',
                        method:'post',
                        data: payJson,// 将payJson对象赋给data
                        success(res) {
                          console.log(res)
                        }
                      })
                      // 跳转到成功界面
                      wx.redirectTo({
                        url: '../../../pages/successful/successful?taskId=' + taskId,
                      })
                    } else if (res.cancel) {
                      console.log('用户点击取消不支付')
                    }
                  }
                })  
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        } else {
          // 显示模态对话框
          wx.showModal({
            title: '红包个数',
            content: '红包个数要大于0个且不大于100个',
          })
        }
      } else {
        // 显示模态对话框
        wx.showModal({
          title: '总赏金',
          content: '总赏金要大于0元且不大于200元',
        })
      }
    } else {
      // 显示模态对话框
      wx.showModal({
        title: '任务要求',
        content: '信息为空或者信息过长',
      })
    } 
  },

  // 获取用户信息
  onLoad: function () {
    wx.getUserInfo({
      success: res => {
        res.userInfo = app.globalData.userInfo
        // app.globalData.userInfo = res.userInfo
        console.log('用户信息',res.userInfo)
        console.log(app.globalData.userInfo)
        this.setData({
          userInfo: res.userInfo,
        })
      }
    })  
  },
})