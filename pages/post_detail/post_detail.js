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
      .then(res => this.setData({ comments: res.data || [] }))
      .catch(err => console.error('Failed to get comment list', err))
  },

  // 点赞 / 取消点赞
  likePost() {
    if (!this.data.postId) return

    toggleLikePost(this.data.postId)
      .then(res => {
        this.setData({
          isLiked: res.liked,
          'post.like_count': res.like_count
        })
      })
      .catch(() => {
        wx.showToast({ title: '点赞失败', icon: 'none' })
      })
  },

  // 输入评论
  onInput(e) {
    this.setData({ inputValue: e.detail.value })
  },

// 发表评论
sendComment() {
  const content = this.data.inputValue.trim()
  if (!content) {
    wx.showToast({
      title: '评论不能为空',
      icon: 'none'
    })
    return
  }

  createComment(this.data.postId, content)
    .then(res => {
      // ⚠️ 统一评论数据结构（关键）
      const newComment = {
        id: res.id || Date.now(),
        content,
        nickname: res.nickname || '我',
        avatar: res.avatar || '/images/default_avatar.png',
        create_time: '刚刚'
      }

      this.setData({
        comments: [...this.data.comments, newComment],
        inputValue: '',
        'post.comment_count': (this.data.post.comment_count || 0) + 1
      })
    })
    .catch(() => {
      wx.showToast({ title: '评论失败', icon: 'none' })
    })
}
})
