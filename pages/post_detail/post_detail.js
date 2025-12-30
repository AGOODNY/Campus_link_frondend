// pages/post_detail/post_detail.js

const {
  fetchPostDetail,
  fetchCommentList,
  createComment,
  toggleLikePost,
  recordPostView
} = require('../../utils/util')

Page({
  data: {
    postId: null,
    post: null,
    comments: [],
    inputValue: '',
    isLiked: false
  },

  onLoad(options) {
    const postId = options.id
    if (!postId) return

    this.setData({ postId })
    recordPostView(postId)

    // 获取帖子详情
    fetchPostDetail(postId)
      .then(res => this.setData({ post: res }))
      .catch(err => console.error('Failed to get post details', err))

    // 获取评论列表
    fetchCommentList(postId)
      .then(r => {
        this.setData({
          comments: r.data || []
        })

        // 延迟写入 storage，要等到 post 已经加载
        const post = this.data.post
        if (post) {
          wx.setStorageSync('post_changed', {
            postId,
            like_count: post.like_count,
            comment_count: r.data?.length ?? post.comment_count
          })
        }
      })
  },

  likePost() {
    if (!this.data.postId) return

    toggleLikePost(this.data.postId)
      .then(res => {
        this.setData({
          isLiked: res.liked,
          'post.like_count': res.like_count
        })

        wx.setStorageSync('post_changed', {
          postId: this.data.postId,
          like_count: res.like_count,
          comment_count: this.data.post?.comment_count
        })
      })
      .catch(() => {
        wx.showToast({ title: 'Like failed', icon: 'none' })
      })
  },

  onInput(e) {
    this.setData({ inputValue: e.detail.value })
  },

  sendComment() {
    const content = this.data.inputValue.trim()
    if (!content) {
      wx.showToast({ title: 'Comments cannot be empty', icon: 'none' })
      return
    }

    createComment(this.data.postId, content)
      .then(() => {
        //评论成功 → 重新获取真实数据
        Promise.all([
          fetchCommentList(this.data.postId),
          fetchPostDetail(this.data.postId)
        ]).then(([cl, pd]) => {
          this.setData({
            comments: cl.data || [],
            post: pd,
            inputValue: ''
          })

          // 同步写入 storage
          wx.setStorageSync('post_changed', {
            postId: this.data.postId,
            like_count: pd.like_count,
            comment_count: cl.data?.length ?? pd.comment_count
          })
        })
      })
      .catch(() => {
        wx.showToast({ title: 'Comments cannot be empty', icon: 'none' })
      })
  }
})
