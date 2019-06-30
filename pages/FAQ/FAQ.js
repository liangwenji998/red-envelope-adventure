// pages/FAQ/FAQ.js
//dd
Page({
  data:{
    icon:'https://www.easyicon.net/api/resizeApi.php?id=1119896&size=128',
    lookOver:false,
    length:'',
    list:[
      {
        title:'红包大冒险怎么玩？',
        presentation:'发起者设置红包金额，个数并且出任务。参加的好友识别图中二维码或者点击分享链接就可以上传任务照片，待发起者审核通过后，即可领取随机数额的红包奖励。',
        length: 1
      },
      {
        title: '我支付了怎么没有发出去？',
        presentation: '布吉岛，建议亲找售后哟~但是我们没有售后呢~~',
        length: 2
      },
      {
        title: '我发布任务后不想分享出去？',
        presentation: '那还有什么意思，你退群吧！',
        length: 3
      },
      {
        title: '好友可以转发我的任务吗？',
        presentation: '亲！自己摸索呢，还有更多好玩、精彩等你呢！',
        length: 5
      },
      {
        title: '发布任务会收取服务费吗？',
        presentation: '亲，必须的哟，收多少看心情的哟~但是逻辑懒得写呢，所以就不收取服务费啦！是不是很开心~',
        length: 6
      },
      {
        title: '未领取的红包，会怎么样处理？',
        presentation: '给我呀！',
        length: 7
      },
      {
        title: '如何提现？',
        presentation: '提现是不可能的！略略略！',
        length: 8
      },
      {
        title: '可以提现到银行卡吗？',
        presentation: '略略略，居然抢我的小钱钱',
        length: 9
      },
    ]
  },
  //点击显示详情
  look:function(e){
    var that = this
    var lookOver = that.data.lookOver
    var id = e.currentTarget.dataset.id
    var length = that.data.length
    console.log(e.currentTarget.dataset.id)
    //判断是打开或关闭
    if (lookOver == false){
      var lookOver = that.data.lookOver
      that.setData({
        lookOver: true,
        length:id
      })
    }else{
      var lookOver = that.data.lookOver
      that.setData({
        lookOver: false,
        length:id
      })
    }
  }
})