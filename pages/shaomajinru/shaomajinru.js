const app = getApp()
Page({
  data: {
    claim: '',//任务内容
    partner: '',//正在参与人数
    red: '',//红包剩余个数
    taskId: '',//任务id
    totalBounty: '',//红包总金额
    totalPartner: '',//任务参与总人数
    totalRed: '',//红包总个数

    currentPage: 0,//当前页码
    pageSize: 0,//每页数据量
    taskId: 0, //任务id
    list:[],//数组

    isFirst: null, //是否参与过这个任务
    userPartnerInfo: null, //用户参与情况
  },

  /**
   * 我也发一个跳转
   */
  meto: function() {
    wx.switchTab({
      url: '../homepage/homepage',
    })
  },

  /**
   * 点击查看大图
   */
  look: function(options) {
    var that = this;
    var imageUrl = options.target.dataset.imageurl;
    imageUrl = imageUrl + "";
    var imageUrls = imageUrl.split("/");
    var note = options.target.dataset.note;
    wx.navigateTo({
      url: '../imgplus/imgplus?imageUrlFirst=' + imageUrls[1] + 
        '&imageUrlLast=' + imageUrls[2] +
        '&note=' + note,
    })
  },

  // 跳转到上传图片页面
  jump:function(option){
    wx.redirectTo({
      url: '../uploadPictures/uploadPictures?taskId=' +this.data.taskId,
    })
  },

  onLoad: function (options) {
    var that = this;
    var taskId = options.taskId; 

    //查询任务信息接口的
    wx.request({
      url: 'http://132.232.21.188:18080/v1/bb_risk/task/findTaskInfo?taskId=' + taskId,
      success(res) {
        that.setData({
          data: res.data,
          taskId: taskId
        })
      }
    })

    //分页获得所有参与者的API
    wx.request({
      url: 'http://132.232.21.188:18080/v1/bb_risk/partner/getPartners',
      method:'post',
      data: {
        currentPage:1,
        pageSize:3,
        taskId: taskId
      },
      success(res) {
        that.setData({
          list: res.data.list
        }) 
      }
    })

    //查询本用户对这个任务的参与情况
    wx.login({
      success: function(loginRes){
        var tacdJson = {};
        tacdJson.code = loginRes.code;
        tacdJson.taskId = taskId;
        wx.request({
          url: 'http://132.232.21.188:18080/v1/bb_risk/partner/findPartnerInfo',
          method: 'post',
          data: tacdJson,
          success: function (findPartnerInfoRes) {
            //如果结果为空，说明用户没有参与过
            if (!findPartnerInfoRes.data){
              that.setData({
                isFirst: true
              })
            }else {
              that.setData({
                userPartnerInfo: findPartnerInfoRes.data,
                isFirst: false
              })
            }
          }
        })
      }
    })
  },
})