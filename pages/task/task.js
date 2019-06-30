var app = getApp()
var nickName = ''//用户名字
var avatarUrl = ''//用户头像
Page({
  data: {
    task_data_release:'',
    task_data_did:'',
    //做过的任务
    release_a_task:[],
    isLastPage:true,
    currentPage: 1,
    //发布过任务
    release_a_taskTow: [],
    isLastPageTow: true,
    taskId:'',//任务id
    totalbounty:'',//金额
  },
  //预设
  onShow: function (options) {
    var that=this
    //获取用户信息
    wx.getUserInfo({
      success: function (res) {
        that.setData({
          nickName: res.userInfo.nickName,
          avatarUrl: res.userInfo.avatarUrl,
        })
      },
    })
    that.taskDataRelease('获取发布的任务数据')
    that.taskDataDid('获取做过的任务数据')
    that.releaseATask('获取发布过的任务')
    that.tasksDone('获取做过的任务')
  },
  //获取发布过的任务数据
  taskDataRelease:function(){
    var that = this
    wx.request({
      url: 'http://132.232.21.188:18080/v1/bb_risk/task/findTaskCollect?userId=' + app.globalData.userId,
      method:'GET',
      success:function(e){
        if (e.data.totalGetBounty == null) {
          e.data.totalGetBounty = 0
        }
        if (e.data.totalTaskRed == null) {
          e.data.totalTaskRed = 0
        }
        var task_data_release = that.data.task_data_release
        that.setData({
          task_data_release:e.data
        })
      }
    })
  },
  //获取做过的任务数据
  taskDataDid:function(){
    var that = this
    wx.request({
      url: 'http://132.232.21.188:18080/v1/bb_risk/partner/findJoinList?userId=' + app.globalData.userId,
      method:'GET',
      success:function(e){
        if (e.data.totalGetBounty == null) {
          e.data.totalGetBounty = 0
        }
        if (e.data.totalJoin == null) {
          e.data.totalJoin = 0
        }
        var task_data_did = task_data_did
        that.setData({
          task_data_did:e.data
        })
      }
    })
  },
  //获取发布过的任务
  releaseATask : function () {
    var that = this
    var dpd = {
      currentPage: that.data.currentPage,
      pageSize: 10,
      userId: app.globalData.userId, //获取全局userId,
    }
    //获取后端交易记录
    wx.request({
      url: 'http://132.232.21.188:18080/v1/bb_risk/task/printTaskList',
      method: "post",
      data: dpd,
      //调用成功
      success: function (e) {
        var release_a_task = that.data.release_a_task
        var isLastPage = that.data.isLastPage
        that.setData({
          release_a_task: that.data.release_a_task.concat(e.data.list),
          isLastPage: e.data.isLastPage
        })
      }
    })
  },
  //获取做过的任务
  tasksDone: function () {
    var that = this
    var dpd = {
      currentPage: that.data.currentPage,
      pageSize: 10,
      userId: app.globalData.userId, //获取全局userId,
    }
    //获取后端交易记录
    wx.request({
      url: 'http://132.232.21.188:18080/v1/bb_risk/user/findJoinGameList',
      method: "post",
      data: dpd,
      //调用成功
      success:function(e){
        var release_a_taskTow = that.data.release_a_taskTow
        that.setData({
          release_a_taskTow: that.data.release_a_taskTow.concat(e.data.list),
          isLastPageTow: e.data.isLastPage
        })
      }
    })
  },


  //上拉
  onReachBottom: function () {
    var that = this
    console.log('上拉')
    if (that.data.isLastPage == true) {
      wx.showToast({
        title: '没有更多数据',
        duration: 500
      })
    } else {
      that.getContentInfo('加载更多数据')
      var newCurrentPage = ++that.data.currentPage //自增
      that.setData({
        currentPage: newCurrentPage
      })
      that.releaseATask('加载数据')
      that.tasksDone('加载数据')
      console.log(that.data.currentPage)
    }
  },


  //获取提示
  getContentInfo: function (message) {
    wx.showLoading({
      title: message,
      duration: 500
    })
  },
  //滑动切换
  swiperTab: function (e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
    this.initial('初始化数据')
  },
  //点击切换
  clickTab: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
    this.initial('初始化数据')
  },
  //初始化数据
  initial:function(){
    var that = this
    var release_a_task = that.data.release_a_task
    var isLastPage =   that.data.isLastPage
    var currentPage =  that.currentPage
    that.setData({
      release_a_task : [],
      isLastPage : true,
      currentPage : 1,
    })
    this.releaseATask('初始化')
  },

  /**
   * 跳转到任务参与界面
   */
  toJoin: function(options) {
    var taskId = options.currentTarget.dataset.taskid;
    wx.navigateTo({
      url: '../shaomajinru/shaomajinru?taskId=' + taskId,
    })
  },

  /**
   * 跳转任务审核页面
   */
  toExamine: function(options) {
    var that = this
    var taskId = options.currentTarget.dataset.taskid;
    wx.navigateTo({
      url: '../examine/examine?taskId=' + taskId,
    })
  },

  //支付提示
  hint:function(e){
    var that = this
    that.setData({
      taskId : e.currentTarget.dataset.taskid,
      totalbounty : e.currentTarget.dataset.totalbounty
    })
    wx.showModal({
      title: '提示',
      content: '请选择‘删除’或是‘支付’该任务',
      cancelText:'删除',
      confirmText:'支付',
      success(res) {
        if (res.confirm) {
          console.log('用户点击支付')
          that.pay('支付')
        } else if (res.cancel) {
          console.log('用户点击删除')
          that.expurgate('删除')
        }
      }
    })
  },

  //删除
  expurgate:function(){
    var that = this
    wx.request({
      url: 'http://www.gsphome.cn:18080/v1/bb_risk/task/deleteTask?taskId=' + that.data.taskId,
      success:function(e){
        if (e.data == 'success'){
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 1000
          })
          that.initial('重新加载')
        }else{
          wx.showModal({
            title: '提示',
            content: '删除失败',
            confirmText: '确认',
          })
        }
      }
    })
  },

  //支付
  pay:function(){
    var that = this
    var payDto ={
      money : that.data.totalbounty,
      taskId: that.data.taskId,
      userId : app.globalData.userId
    }
    wx.request({
      url: 'http://www.gsphome.cn:18080/v1/bb_risk/user/pay',
      method: "post",
      data: payDto,
      success:function(e){
        if (e.data == 'success') {
          wx.showToast({
            title: '支付成功',
            icon: 'success',
            duration: 1000
          })
          that.initial('重新加载')
        } else {
          wx.showModal({
            title: '提示',
            content: '支付失败',
            confirmText: '确认',
          })
        }
      }
    })
  }

})