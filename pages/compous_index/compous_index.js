// pages/compous_index/compous_index.js
const { fetchPostList } = require('../../utils/util')


Page({
  data: {
    tabBarHeight: 80, // Tab栏高度
    contentPadding: 28, // 内容区域padding-top

    showSortMenu: false,
    sortType: 'hot', // 默认按热度
    
    // Tab数据
    tabs: [
      { id: 1, name: 'On Campus' },
      { id: 2, name: 'Alumni Corner' }
    ],
    currentTab: 0,
    
    // 轮播图配置
    indicatorDots: true,     // 是否显示指示点
    autoplay: true,          // 是否自动播放
    interval: 3000,          // 自动切换时间间隔（ms）
    duration: 500,           // 滑动动画时长（ms）
    circular: true,          // 是否采用衔接滑动
    
    // 开发阶段使用模拟数据
    useMock: true,
    
    // 瀑布流
    postList: [],      // 所有帖子数据
    leftColumn: [],    // 左列帖子
    rightColumn: [],   // 右列帖子
    page: 1,           // 当前页码
    pageSize: 10,      // 每页数量
    loading: false,    // 加载状态
    hasMore: true,     // 是否还有更多
    
    // 筛选参数
    category: 'campus_life',
    order: 'hot',
    
    // 轮播图数据
    swiperList: [
      {
        id: 1,
        imageUrl: '/pages/compous_index/compous_image/2.png',
        linkUrl: '',
        title: "Advertise Here",
        desc: "Live your best campus life"
      },
      {
        id: 2,
        imageUrl: '/pages/compous_index/compous_image/3.png',
        linkUrl: '',
        title: "Advertise Here",
        desc: "Live your best campus life"
      },
      {
        id: 3,
        imageUrl: '/pages/compous_index/compous_image/4.png',
        linkUrl: '',
        title: "Advertise Here",
        desc: "Live your best campus life"
      },
      {
        id: 4,
        imageUrl: '/pages/compous_index/compous_image/5.png',
        linkUrl: '',
        title: "Advertise Here",
        desc: "Live your best campus life"
      },
      {
        id: 5,
        imageUrl: '/pages/compous_index/compous_image/6.png',
        linkUrl: '',
        title: "Advertise Here",
        desc: "Live your best campus life"
      }
    ]
  },

  onLoad: function() {
    console.log('页面加载');
    this.setData({
        order: 'hot',
        sortType: 'hot'
      });
    this.loadPosts();
  },

  // 监听输入框内容变化
  onSearchInput(e) {
    this.searchValue = e.detail.value
  },

  // 点击搜索框或回车触发跳转
  goSearch() {
    const keyword = this.searchValue || ''
    wx.navigateTo({
      url: `/pages/life_search/life_search?q=${keyword}`
    })
  },

  // 切换Tab
  switchTab: function(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    this.setData({
      currentTab: index,
      page: 1,
      postList: [],
      leftColumn: [],
      rightColumn: [],
      hasMore: true
    });
    
    // 根据Tab切换分类
    const category = index === 0 ? 'campus_life' : 'return_school';
    this.setData({ category: category });
    
    this.loadPosts();
  },

  // 加载帖子数据
  // 加载帖子数据
loadPosts: async function () {
  if (this.data.loading || !this.data.hasMore) return;

  this.setData({ loading: true });

  try {
    const result = await fetchPostList({
      category: this.data.category,
      order: this.data.order,
      page: this.data.page,
      limit: this.data.pageSize,
      // 让 util.js 能按页面配置选择 mock
      useMock: this.data.useMock
    });

    if (result.code === 200) {
      // 1️⃣ 处理原始数据
      let newPosts = this.processPostData(result.data.list || []);

      // 2️⃣ ⭐ 在分列之前排序
      if (this.data.order === 'hot') {
        newPosts.sort((a, b) => b.likes - a.likes);
      } else if (this.data.order === 'new') {
        newPosts.sort(
          (a, b) => new Date(b.time) - new Date(a.time)
        );
      }

      // 3️⃣ 再进行瀑布流分列
      this.distributeToColumns(newPosts);

      this.setData({
        loading: false,
        page: this.data.page + 1,
        hasMore: result.data.hasMore !== false
      });
    } else {
      throw new Error(result.message || '数据加载失败');
    }
  } catch (error) {
    console.error('加载失败', error);
    this.setData({ loading: false });
  }
},
  
// 点击帖子跳转到详情页
onPostTap: function(e) {
  const postId = e.currentTarget.dataset.id;
  if (postId) {
      wx.navigateTo({
          url: `/pages/post_detail/post_detail?id=${postId}`
      });
  }
},

  // 处理帖子数据
  processPostData: function(apiData) {
    console.log('处理原始数据:', apiData);
    
    if (!apiData || !Array.isArray(apiData)) {
      console.warn('API数据格式不正确');
      return [];
    }
    
    return apiData.map((item, index) => {
      const images = this.processImages(item.images);
      return {
        id: item.id?.toString() || `mock_${Date.now()}_${index}`,
        title: item.title || '校园生活分享',
        desc: item.content || '这里是校园生活的精彩内容...',
        images: images,
        user: {
          name: item.user_name || `用户${index + 1}`,
          avatar: item.avatar || this.getDefaultAvatar()
        },
        likes: item.like_count ?? 0,
        comments: item.comment_count ?? 0,
        time: this.formatTime(item.create_time),
        tag: item.category || '校园',
        height: this.calculatePostHeight(item)
      };
    });
  },

  // 处理图片
  processImages: function(images) {
    if (!images) {
      return ['https://picsum.photos/400/500?random=' + Math.random()];
    }
    
    if (Array.isArray(images)) {
      return images.filter(img => img && typeof img === 'string');
    }
    
    if (typeof images === 'string') {
      return [images];
    }
    
    return ['https://picsum.photos/400/500'];
  },

  // 获取默认头像
  getDefaultAvatar: function() {
    const defaultAvatars = [
      'https://randomuser.me/api/portraits/men/1.jpg',
      'https://randomuser.me/api/portraits/women/2.jpg',
      'https://randomuser.me/api/portraits/men/3.jpg',
      'https://randomuser.me/api/portraits/women/4.jpg'
    ];
    return defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)];
  },

  // 格式化时间
  formatTime: function(timestamp) {
    if (!timestamp) {
      return this.formatSimpleTime();
    }
    
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        return this.formatSimpleTime();
      }
      
      const now = new Date();
      const diff = now - date;
      
      if (diff < 60000) return 'Just now';
      if (diff < 3600000) return Math.floor(diff / 60000) + ' mins ago';
      if (diff < 86400000) return Math.floor(diff / 3600000) + ' hrs ago';
      return Math.floor(diff / 86400000) + 'days ago';
    } catch (error) {
      return this.formatSimpleTime();
    }
  },

  // 简单的时间格式化（备用）
  formatSimpleTime: function() {
    const times = ['刚刚', '1小时前', '2小时前', '1天前', '2天前', '3天前'];
    return times[Math.floor(Math.random() * times.length)];
  },

  // 计算帖子高度
  calculatePostHeight: function(post) {
    // 基础高度
    let height = 400; // 图片区域
    
    // 根据内容调整
    if (post.title && post.title.length > 20) {
      height += 40;
    }
    
    if (post.content && post.content.length > 50) {
      height += 60;
    }
    
    // 底部固定区域
    height += 120;
    
    return height;
  },




  // 分配到左右列
  distributeToColumns: function(newPosts) {
    console.log('开始分配到左右列，新帖子数:', newPosts.length);
    
    let leftHeight = this.getColumnHeight(this.data.leftColumn);
    let rightHeight = this.getColumnHeight(this.data.rightColumn);
    
    const leftColumn = [...this.data.leftColumn];
    const rightColumn = [...this.data.rightColumn];
    
    newPosts.forEach((post, index) => {
      if (leftHeight <= rightHeight) {
        leftColumn.push(post);
        leftHeight += post.height || 300;
      } else {
        rightColumn.push(post);
        rightHeight += post.height || 300;
      }
    });
    
    this.setData({
      leftColumn,
      rightColumn,
      postList: [...this.data.postList, ...newPosts]
    });
    
    console.log('分配完成，左列:', leftColumn.length, '右列:', rightColumn.length);
  },

  getColumnHeight: function(column) {
    return column.reduce((sum, post) => sum + (post.height || 300), 0);
  },

  // 备用模拟数据
  loadBackupMockData: function() {
    console.log('使用备用模拟数据');
    
    const mockPosts = this.generateSimpleMockData();
    this.distributeToColumns(mockPosts);
    
    this.setData({
      loading: false,
      page: this.data.page + 1,
      hasMore: true
    });
  },

  generateSimpleMockData: function() {
    const posts = [];
    const startId = (this.data.page - 1) * 10 + 1;
    
    for (let i = 0; i < 10; i++) {
      const id = startId + i;
      posts.push({
        id: id,
        title: `校园生活分享 ${id}`,
        desc: '这里是校园生活的精彩内容...',
        images: [`https://picsum.photos/400/500?random=${id}`],
        user: {
          name: `用户${id}`,
          avatar: `https://i.pravatar.cc/50?img=${id}`
        },
        likes: Math.floor(Math.random() * 1000),
        comments: Math.floor(Math.random() * 200),
        time: this.formatSimpleTime(),
        tag: '校园',
        height: 350 + Math.random() * 200
      });
    }
    
    return posts;
  },

  // 轮播图切换事件
  onSwiperChange: function(e) {
    console.log('当前轮播图索引:', e.detail.current);
  },

  // 点击轮播图事件
  onSwiperTap: function(e) {
    const index = e.currentTarget.dataset.index;
    const item = this.data.swiperList[index];
    console.log('点击了轮播图:', index, item);
    
    if (item.linkUrl) {
      wx.navigateTo({
        url: item.linkUrl
      });
    }
  },

  // 页面滚动到底部
  onReachBottom: function() {
    console.log('滚动到底部，加载更多');
    this.loadPosts();
  },

  // 下拉刷新
  onPullDownRefresh: function() {
    console.log('下拉刷新');
    
    this.setData({
      page: 1,
      postList: [],
      leftColumn: [],
      rightColumn: [],
      hasMore: true
    });
    
    this.loadPosts();
    
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1000);
  },
  // 点击 sort 图标
  toggleSortMenu() {
    this.setData({
      showSortMenu: !this.data.showSortMenu
    })
  },

  //重置列表，切换排序方式
  resetPostList() {
    this.setData({
      page: 1,
      postList: [],
      leftColumn: [],
      rightColumn: [],
      hasMore: true,
      loading: false
    });
  },


  // 选择排序方式
  selectSort(e) {
    const type = e.currentTarget.dataset.type; // hot | new
  
    // 如果点击的是当前排序方式，直接关闭菜单
    if (type === this.data.sortType) {
      this.setData({ showSortMenu: false });
      return;
    }
  
    console.log('切换排序方式为：', type);
  
    this.setData({
      sortType: type,
      order: type,          
      showSortMenu: false
    });
  
    // ⭐ 重置瀑布流 + 重新加载
    this.resetPostList();
    this.loadPosts();
  },
  

});