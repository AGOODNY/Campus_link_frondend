// pages/problemDetail/problemDetail.js
const api = require('../../utils/question')

Page({
  data: {
    question: null,
    replies: [],
    isStaff: false,

    statusMap: {
      pending: "pending",
      processing: "accepted",
      solved: "resolved"
    }
  },

  async onLoad(options) {
    const id = Number(options.id)
    const isStaff = wx.getStorageSync("is_staff") == 1

    try {
      const detail = await api.fetchIssueDetail(id)
      this.setData({
        question: detail,
        replies: detail.nodes,
        isStaff
      })
    } catch (e) {
      wx.showToast({ title: 'Load failed', icon: 'none' })
    }
  },

  async submitReply(e) {
    const content = e.detail.value.reply
    if (!content) return wx.showToast({ title: "Reply cannot be empty", icon: "none" })

    await api.postNode(this.data.question.id, {
      node_title: "Reply",
      content
    })

    wx.showToast({ title: "Submission Successful", icon: "success" })

    const detail = await api.fetchIssueDetail(this.data.question.id)
    this.setData({
      question: detail,
      replies: detail.nodes
    })
  },

  previewImage(e) {
    wx.previewImage({
      urls: this.data.question.images,
      current: e.currentTarget.dataset.src
    })
  }
})
