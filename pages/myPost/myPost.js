Page({
  data: {
    leftList: [],
    rightList: []
  },

  onLoad() {
    const list = [
      {
        id: 1,
        title: 'TEST',
        cover: '/pages/history/images/5.png',
        avatar: '/pages/history/images/5.png',
        nickname: 'YO'
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
