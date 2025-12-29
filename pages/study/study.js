const { fetchPostList } = require('../../utils/util')

Page({
  data: {
    tabBarHeight: 80,
    contentPadding: 28,
    showSortMenu: false,
    sortType: 'hot',

    // 轮播图配置
    indicatorDots: true,     // 是否显示指示点
    autoplay: true,          // 是否自动播放
    interval: 3000,          // 自动切换时间间隔（ms）
    duration: 500,           // 滑动动画时长（ms）
    circular: true,          // 是否采用衔接滑动

    // ====== 核心数据 ======
    postList: [],
    leftColumn: [],
    rightColumn: [],
    page: 1,
    pageSize: 10,
    loading: false,
    hasMore: true,

    // 学习区固定分类
    category: 'study',
    order: 'hot',

    // 是否使用 mock
    useMock: false,

    //搜索
    searchValue: "", 

    // 轮播图（学习区自己的）
    swiperList: [
      {
        id: 1,
        imageUrl: '/pages/study/study_image/2.png',
        title: 'Advertise Here',
        desc: 'Share your learning experience'
      },
      {
        id: 2,
        imageUrl: '/pages/study/study_image/3.png',
        title: 'Advertise Here',
        desc: 'Share your learning experience'
      },
      {
        id: 3,
        imageUrl: '/pages/study/study_image/4.png',
        title: 'Advertise Here',
        desc: 'Share your learning experience'
      }
    ]
  },

  onLoad() {
    this.loadPosts()
  },


  onSearchInput(e) {
    this.setData({
      searchValue: e.detail.value
    })
  },
    // 点击搜索框或回车触发跳转
  goSearch() {
    const keyword = this.data.searchValue.trim()
    wx.navigateTo({
      url: `/pages/study_search/study_search?q=${encodeURIComponent(keyword)}`
    })
  },
      
  // ====== 加载帖子 ======
  async loadPosts() {
    if (this.data.loading || !this.data.hasMore) return
    this.setData({ loading: true })

    try {
      const res = await fetchPostList({
        postType: 'study',   // 关键
        order: this.data.order,
        page: this.data.page,
        limit: this.data.pageSize
      })

      if (res.code !== 200) throw new Error('load failed')

      let newPosts = this.processPostData(res.data.list || [])

      // 排序
      if (this.data.order === 'hot') {
        newPosts.sort((a, b) => b.likes - a.likes)
      } else {
        newPosts.sort((a, b) => new Date(b.time) - new Date(a.time))
      }

      this.distributeToColumns(newPosts)

      this.setData({
        page: this.data.page + 1,
        hasMore: res.data.hasMore !== false,
        loading: false
      })
    } catch (e) {
      console.error(e)
      this.setData({ loading: false })
    }
  },

  // ====== 数据处理 ======
  processPostData(list) {
    return list.map((item, index) => ({
      id: item.id.toString(),
      title: item.title || '学习分享',
      desc: item.content || '',
      images: this.processImages(item.images),
      user: {
        name: item.nickname || item.user_name || '匿名用户',
        avatar: item.avatar || this.getDefaultAvatar()
      },
      likes: item.like_count ?? 0,
      comments: item.comment_count ?? 0,
      time: this.formatTime(item.create_time),
      height: this.calculatePostHeight(item)
    }))
  },

  processImages(images) {
    if (Array.isArray(images) && images.length) return images
    return ['https://picsum.photos/400/500?random=' + Math.random()]
  },

  getDefaultAvatar() {
    return 'https://i.pravatar.cc/100'
  },

  formatTime(time) {
    if (!time) return 'just now'
    const diff = Date.now() - new Date(time)
    if (diff < 60000) return 'just now'
    if (diff < 3600000) return Math.floor(diff / 60000) + 'mins ago'
    if (diff < 86400000) return Math.floor(diff / 3600000) + 'hrs ago'
    return Math.floor(diff / 86400000) + 'days ago'
  },

  calculatePostHeight(post) {
    let h = 400
    if (post.title?.length > 20) h += 40
    if (post.content?.length > 50) h += 60
    return h + 120
  },

  // ====== 瀑布流 ======
  distributeToColumns(posts) {
    let left = [...this.data.leftColumn]
    let right = [...this.data.rightColumn]

    let lh = this.getColumnHeight(left)
    let rh = this.getColumnHeight(right)

    posts.forEach(p => {
      if (lh <= rh) {
        left.push(p)
        lh += p.height
      } else {
        right.push(p)
        rh += p.height
      }
    })

    this.setData({
      leftColumn: left,
      rightColumn: right,
      postList: [...this.data.postList, ...posts]
    })
  },

  getColumnHeight(col) {
    return col.reduce((s, i) => s + (i.height || 300), 0)
  },

  // ====== 排序 ======
  toggleSortMenu() {
    this.setData({ showSortMenu: !this.data.showSortMenu })
  },

  selectSort(e) {
    const type = e.currentTarget.dataset.type
    if (type === this.data.sortType) return

    this.setData({
      sortType: type,
      order: type,
      showSortMenu: false,
      page: 1,
      postList: [],
      leftColumn: [],
      rightColumn: [],
      hasMore: true
    })

    this.loadPosts()
  },

  // ====== 交互 ======
  onPostTap(e) {
    wx.navigateTo({
      url: `/pages/post_detail/post_detail?id=${e.currentTarget.dataset.id}`
    })
  },

  onReachBottom() {
    this.loadPosts()
  },

  onPullDownRefresh() {
    this.setData({
      page: 1,
      postList: [],
      leftColumn: [],
      rightColumn: [],
      hasMore: true
    })
    this.loadPosts()
    setTimeout(wx.stopPullDownRefresh, 800)
  }
})
