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

  // 处理搜索返回数据（头像 / 名字 / 图片）
  formatPosts(list) {
    return list.map((item, index) => ({
      id: item.id,
      title: item.title,
      desc: item.content,
      images: item.images?.map(img => api.normalizeImage(img)) || [],
      user: {
        name: item.user_name || `用户${index + 1}`,
        avatar: item.avatar || this.getDefaultAvatar()
      },
      likes: item.like_count,
      comments: item.comment_count,
      time: item.created_at,
    }))
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

  onPostTap: function(e) {
    const postId = e.currentTarget.dataset.id;
    if (postId) {
        wx.navigateTo({
            url: `/pages/post_detail/post_detail?id=${postId}`
        });
    }
  },
})

