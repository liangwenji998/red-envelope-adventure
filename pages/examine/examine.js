// pages/examine/examine.js kk
Page({
  /**
   * 页面的初始数据
   */
  data: {
    taskId: null,
    pass: '',
    share: 'share',
    scrollHeight: 0,
    page: true,
    num: 1,
    task: '',
    tips: '暂无更多用户参加',
    list: [],
    buttonStyle: 'Invitable',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this

    //获取前一个页面传过来的taskId
    that.setData({
      taskId: options.taskId
    })

    var query = wx.createSelectorQuery();
    query.select('#top').boundingClientRect()
    query.select('#tips').boundingClientRect()
    query.exec(function(res) {
      var x = res[0].height
      var y = res[1].height
      wx.getSystemInfo({
        success: function(res) {
          that.setData({
            scrollHeight: res.windowHeight - x - y,
          })
        }
      })
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this
    var variable = that.data.list
    wx.request({
      url: 'http://132.232.21.188:18080/v1/bb_risk/task/findTaskInfo?taskId=' + that.data.taskId,
      method: 'GET',
      success(res) {
        that.setData({
          task: res.data
        })
        if (res.data.red === res.data.totalRed) {
          that.setData({
            buttonStyle: 'notInvitable',
            share: '',
            tips: '已是最后一页'
          })
        }
        wx.request({
          url: 'http://132.232.21.188:18080/v1/bb_risk/partner/getPartners',
          method: 'POST',
          data: {
            currentPage: that.data.num,
            pageSize: 5,
            taskId: that.data.taskId
          },
          success(res) {
            console.log(res)
            if (that.data.page === false) {
              that.setData({
                top: 0
              })
            } else {
              that.setData({
                page: false
              })
              if (that.data.num > res.data.lastPage) {
                wx.showToast({
                  title: that.data.tips,
                  icon: 'none',
                  duration: 2000
                })
                that.setData({
                  num: that.data.num - 1
                })
              } else {
                wx.hideToast()
                for (var x = 0; x < res.data.list.length; x++) {
                  var src = 'http://www.gsphome.cn' + res.data.list[x].imageUrl
                  res.data.list[x].imageUrl = src
                  variable.push(res.data.list[x])
                }
                that.setData({
                  list: variable,
                })
              }
            }
          }
        })
      }
    })
  },
  paging() {
    var that = this
    that.setData({
      num: that.data.num + 1,
      page: true
    })
    wx.showToast({
      title: '加载第' + that.data.num + '页',
      icon: 'loading',
      duration: 2000
    })
    that.onShow()
  },
  check(e) {
    var that = this
    console.log(e.currentTarget.dataset)
    var checkData = e.currentTarget.dataset
    var isPass = ''
    wx.showModal({
      title: '审核',
      content: '该用户是否通过任务',
      confirmText: '通过',
      cancelText: "不通过",
      success(res) {
        if (res.confirm === true) {
          e.currentTarget.dataset.pass = "pass"
          that.checking(checkData)
        } else if (res.cancel === true) {
          e.currentTarget.dataset.pass = "nopass"
          that.checking(checkData)
        }
      }
    })
  },
  checking(e) {
    var that = this
    wx.request({
      url: 'http://132.232.21.188:18080/v1/bb_risk/task/check?userId=' + e.id + '&taskId=' + e.task + '&isPass=' + e.pass,
      method: 'POST',
      data: {},
      success(res) {
        console.log(res)
        that.setData({
          num:1,
          list:[],
          tips: '暂无更多用户参加',
          page:true
        })
        that.onShow()
      }
    })
  },
  imgplus(e) {
    console.log(e)
    var imageUrl = e.currentTarget.dataset.src;
    imageUrl = imageUrl + "";
    var imageUrls = imageUrl.split("/");
    wx.navigateTo({
      url: '../imgplus/imgplus?imageUrlFirst=' + imageUrls[imageUrls.length - 2] + '&imageUrlLast=' + imageUrls[imageUrls.length - 1]+ '&note=' + e.currentTarget.dataset.note,
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    var that = this
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
  }
})