// pages/transactionRecord/transactionRecord.js
//交易记录页面
const app = getApp()
Page({
  data: {
    list: [],
    money: '',
    pageNum: '',
    isLastPage: true,
    currentPage: 1
  },
  getContentInfo: function (message) {
    wx.showLoading({
      title: message,
      duration: 500
    })
  },
  //下拉
  onPullDownRefresh: function () {
    console.log('下拉');
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.data.pageNum = 1
    this.getContentInfo('正在刷新数据')
  },
  //上拉
  onReachBottom: function () {
    var that = this
    if (that.data.isLastPage == true) {
      wx.showToast({
        title: '没有更多数据',
        duration:500
      })
    } else {
      that.getContentInfo('加载更多数据') 
      var newCurrentPage = ++that.data.currentPage //自增
      that.setData({
        currentPage: newCurrentPage
      })
      that.request('加载数据')
      console.log(that.data.currentPage)
    }
  },
  //周期函数,每次打开都会刷新
  onShow: function () {
    this.request('加载数据')
  },
  request: function () {
    var that = this
    var dpd = {
      currentPage: that.data.currentPage,
      pageSize: 10,
      userId: app.globalData.userId, //获取全局userId,
    }
    //获取后端交易记录
    wx.request({
      url: 'http://132.232.21.188:18080/v1/bb_risk/deal/dealList',
      method: "post",
      data: dpd,
      //调用成功
      success: function (e) {
        console.log(e)
        var lists = e.data.list
        var money = {};
        for (var index in lists) {
          money[index] = Number(lists[index].sum) //转换为number类型
        }
        var isLastPage = that.data.isLastPage
        console.log(money)
        that.setData({
          list: that.data.list.concat(e.data.list),
          money: money,
          isLastPage: e.data.isLastPage
        })
        console.log(that.data.list)
        console.log(that.data.isLastPage)
      }
    })
  }
})
