//浏览记录js的真版本
const { fetchViewHistory } = require('../../utils/util')

Page({
  data: {
    leftList: [],
    rightList: []
  },

  onShow() {
    this.loadHistory()
  },

  loadHistory() {
    fetchViewHistory().then(list => {
      this.splitWaterfall(list)
    }).catch(err => console.error(err))
  },
  

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

  // 点击帖子跳转详情
  goDetail(e) {
    const id = e.currentTarget.dataset.id
    if (!id) return
    wx.navigateTo({
      url: `/pages/post_detail/post_detail?id=${id}`
    })
  }
})
