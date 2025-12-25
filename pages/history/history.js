
//history.js的假数据版本
Page({
  data: {
    leftList: [],
    rightList: []
  },

  onLoad() {
    const list = [
      {
        id: 1,
        title: 'This little kitten is really cute!',
        cover: '/pages/history/images/9.jpg',
        avatar: '/pages/history/images/8.png',
        nickname: 'Ori'
      },
      {
        id: 2,
        title: 'LONG TIME NO SEE',
        cover: '/pages/history/images/10.jpg',
        avatar: '/pages/history/images/6.png',
        nickname: 'Yara'
      },
      {
        id: 3,
        title: 'Can someone tell me why my code isnt working properly?',
        cover: '/pages/history/images/11.png',
        avatar: '/pages/history/images/6.png',
        nickname: 'Yara'
      },
      {
        id: 4,
        title: 'TEST',
        cover: '/pages/history/images/5.png',
        avatar: '/pages/history/images/5.png',
        nickname: 'Yara'
      }
    ]

    this.splitWaterfall(list)
  },

  /* 简单分配左右列 */
  splitWaterfall(list) {
    const left = []
    const right = []

    list.forEach((item, index) => {
      index % 2 === 0 ? left.push(item) : right.push(item)
    })

    this.setData({
      leftList: left,
      rightList: right
    })
  },

  goDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`
    })
  }
})
