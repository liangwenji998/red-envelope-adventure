// pages/redPacket/redPacket.js
const ctx = wx.createCanvasContext('secondCanvas')
var myCanvasWidth = ''
var myCanvasHeight=''
Page({
  data: {
    img: "https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=326330914,3876458603&fm=27&gp=0.jpg",
    userhead: "",
    ratio: "",//分辨率
    qrcode: "",//二维码
    fingerprint: "",//指纹
    qecodeBianKuang: "",//二维码边框
  },
  click: function () {
    if (this.data.display != true) {
      this.setData({
        display: true
      })
    } else {
      this.setData({
        display: false
      })
    }
  },
  save: function () {
    var that = this
    wx.showLoading({
      title: '正在保存',
      mask: true,
    })
    setTimeout(function () {
      wx.canvasToTempFilePath({
        canvasId: 'secondCanvas',
        success: function (res) {
          wx.hideLoading();
          var tempFilePath = res.tempFilePath;
          wx.saveImageToPhotosAlbum({
            filePath: tempFilePath,
            success(res) {
              wx.showModal({
                content: '图片已保存到相册，赶紧晒一下吧~',
                showCancel: false,
                confirmText: '好的',
                confirmColor: '#333',
                success: function (res) {
                  if (res.confirm) { }
                },
                fail: function (res) { }
              })
            },
            fail: function (res) {
              wx.showToast({
                title: res.errMsg,
                icon: 'none',
                duration: 2000
              })
            }
          })
        }
      });
    }, 1000);
  },
  onLoad: function (options) {
    var that = this;
    var screenWidth="";//手机宽
    var winHeight= "";//手机高
    var canvasheight = '';//画布大小
    var fons=''//字体大小
    var tops=''//距离顶端的高度
    var canvasWidth=''
    var canvasHeight=''
    wx.getSystemInfo({
      success: res => {
        myCanvasWidth = res.windowWidth - 56
        myCanvasHeight = res.windowHeight - 200
        that.setData({
          canvasWidth: myCanvasWidth,
          canvasHeight: myCanvasHeight,
          screenWidth: res.screenWidth,
          winHeight: res.windowHeight,
          ratio: res.pixelRatio
        })
        that.setData({
          canvasheight : Number(that.data.winHeight) - 200,
          fons : Number(that.data.screenWidth),
          wid: Number(that.data.screenWidth),
          tops: Number(that.data.winHeight)
        })
      }
    })
    wx.getImageInfo({
      src: 'https://hbimg.huabanimg.com/81fa5b0268669256495d3d2c4b5f53c12e0d51bc1980-qnW7aA_fw658',//指纹
      success(res) {
        that.setData({
          fingerprint: res.path
        })
      }
    })
    wx.getImageInfo({
      src: 'http://47.102.217.131:8080/88/image/qecodeBianKuang.png',//二维码边框
      success(res) {
        that.setData({
          qecodeBianKuang: res.path
        })
      }
    })
    wx.getUserInfo({
      success(res) {
        wx.getImageInfo({
          src: 'http://47.102.217.131:8080/88/image/qrcode.png',//二维码
          success(e) {
            //console.log(e);
            that.setData({
              qrcode: e.path
            })
          }
        })
        wx.getImageInfo({
          src: res.userInfo.avatarUrl,
          success(e) {
            that.setData({
              userhead: e.path
            })
            wx.getImageInfo({
              src: that.data.img,
              success(res) {
                //console.log(res)
                ctx.setFillStyle('#c63329')//下部分背景色
                ctx.setStrokeStyle('#c63329')
                ctx.rect(0, 0, that.data.screenWidth, 1000)
                ctx.fill()
                //画弧线
                ctx.beginPath()
                ctx.fill()
                // 开口弧线
                ctx.arc(that.data.canvasWidth / 2, 0, that.data.canvasHeight / 2, 0, 2 * Math.PI)//位置
                ctx.setLineWidth('1')
                ctx.setStrokeStyle('rgb(213, 43, 77)')
                ctx.setFillStyle('#dc3a2f')
                ctx.fill()
                var gber = that.data.qecodeBianKuang
                ctx.drawImage(gber, (myCanvasWidth - myCanvasWidth / 2.8) / 2, (myCanvasHeight - myCanvasHeight/2.8) / 2, myCanvasWidth / 2.8, myCanvasWidth / 2.8)//背景二维码

                var er = that.data.qrcode
                ctx.drawImage(er, (myCanvasWidth - myCanvasWidth / 4) / 2, (myCanvasHeight - myCanvasHeight / 4) / 2, myCanvasWidth / 4, myCanvasWidth / 4);//二维码

                var img = that.data.fingerprint
                ctx.drawImage(img, (myCanvasWidth - myCanvasWidth / 6) / 2, (myCanvasHeight - myCanvasHeight / 6) / 1.2, myCanvasWidth / 6, myCanvasWidth / 6);//指纹

                //以下是页面的文字
                ctx.setFontSize(that.data.fons/51)
                ctx.setFillStyle('white')
                var txt = "发布一个大冒险红包"
                ctx.fillText(txt, (that.data.canvasWidth - ctx.measureText(txt).width) / 2, that.data.canvasHeight / 4)

                ctx.setFontSize(that.data.fons / 39)
                ctx.setFillStyle('white')
                var txt2 ="完成大冒险即可领取红包"
                ctx.fillText(txt2, (that.data.canvasWidth - ctx.measureText(txt2).width) / 2, that.data.canvasHeight / 3.5)

                ctx.setFontSize(that.data.fons / 52)
                ctx.setFillStyle('white')
                var txt3 = "长按识别小程序，玩大冒险领红包"
                ctx.fillText(txt3, (that.data.canvasWidth - ctx.measureText(txt3).width) / 2, that.data.canvasHeight/1.05)

                ctx.save(); // 保存当前ctx的状态
                ctx.beginPath()//路径设置
                ctx.arc(myCanvasWidth / 2, myCanvasWidth / 50, myCanvasWidth / 7, 0, 2 * Math.PI); //画出圆
                ctx.clip(); //裁剪上面的圆形
                
                var avatar = that.data.userhead
                ctx.drawImage(avatar, (myCanvasWidth - myCanvasWidth / 7) / 2, myCanvasHeight / 100, myCanvasWidth /7, myCanvasWidth / 7); // 在刚刚裁剪的园上画图 头像
                ctx.restore(); // 还原状态
                ctx.draw(that.save())
              }
            })
          }
        })
      }
    })
  },
})