const api = require('../../utils/util.js')

Page({
  data: {
    keyword: '',
    leftColumn: [],
    rightColumn: [],
    loaded: false
  },

  onLoad(options) {
    if (options.q) {
      this.setData({ keyword: options.q })
      this.doSearch(options.q)
    }
  },

  onInput(e) {
    this.setData({ keyword: e.detail.value })
  },

  onSearch() {
    this.doSearch(this.data.keyword)
  },

  async doSearch(keyword) {
    if (!keyword) return
  
    const res = await api.searchLife(keyword)
    const list = res?.data?.list || []
  
    // 分列
    let left = []
    let right = []
    list.forEach((item, index) => {
      if (index % 2 === 0) left.push(item)
      else right.push(item)
    })
  
    this.setData({
      leftColumn: left,
      rightColumn: right,
      loaded: true
    })
  },
  

  goDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/life_detail/life_detail?id=${id}`
    })
  }
})
