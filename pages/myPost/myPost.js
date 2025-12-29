const api = require('../../utils/util.js')
const BASE_MEDIA_URL = "http://172.20.10.3:8000"

Page({
  data: {
    leftList: [],
    rightList: []
  },

  onLoad() {
    this.loadMyPosts()
  },

  async loadMyPosts() {
    try {
      const list = await api.fetchMyPosts()

      const mapped = list.map(p => ({
        id: p.id,
        title: p.title,
        cover: p.images && p.images.length > 0
          ? api.normalizeImage(p.images[0])
          : "../../images/default.jpg",   // 兜底图片
        avatar: p.avatar
          ? api.normalizeImage(p.avatar)
          : "../../images/default.jpg",  // 兜底头像
        nickname: p.user_name || "User"
      }))

      this.splitWaterfall(mapped)
    } catch (e) {
      console.error(e)
    }
  },

  splitWaterfall(list) {
    const left = [], right = []
    list.forEach((item, index) =>
      (index % 2 === 0 ? left : right).push(item)
    )
    this.setData({ leftList: left, rightList: right })
  },

  goDetail(e) {
    const id = e.currentTarget.dataset.id
    if (!id) return
    wx.navigateTo({
      url: `/pages/post_detail/post_detail?id=${id}`
    })
  }
})
