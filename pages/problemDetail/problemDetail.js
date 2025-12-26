const api = require('../../utils/question')

Page({
  data: {
    question: null,
    replies: [],
  },

  async onLoad(options) {
    const id = Number(options.id)
    try {
      const detail = await api.fetchIssueDetail(id)
      this.setData({
        question: detail,
        replies: detail.replies
      })
    } catch (e) {
      console.error("fail to load problem detail", e)
      wx.showToast({ title: 'Load failed', icon: 'none' })
    }
  },

  async submitReply(e) {
    const content = e.detail.value.reply
    if (!content) return

    await api.postNode(this.data.question.id, {
      node_title: 'Reply',
      node_status: 'processing',
      content
    })

    const detail = await api.fetchIssueDetail(this.data.question.id)
    this.setData({ replies: detail.replies })
  }
})
