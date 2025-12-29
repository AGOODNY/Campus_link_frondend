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

  formatPosts(list) {
    return list.map(item => {
      return {
        id: item.id,
        title: item.title,
        content: item.content,
        images: item.images?.map(img => api.normalizeImage(img)) || [],
        author: {
          nickname: item.user_name || 'A_Guest',
          avatar: item.avatar ? api.normalizeImage(item.avatar) : '../../images/default.jpg'
        },
        like_count: item.like_count,
        comment_count: item.comment_count,
        created_at: item.create_time
      }
    })
  },  

  async doSearch(keyword) {
    if (!keyword) return
    
    const res = await api.searchLife(keyword)
    let list = res?.data?.list || []

    list = this.formatPosts(list)

    // 分列显示
    let left = []
    let right = []
    list.forEach((item, idx) => {
      if (idx % 2 === 0) left.push(item)
      else right.push(item)
    })

    this.setData({
      leftColumn: left,
      rightColumn: right,
      loaded: true
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
