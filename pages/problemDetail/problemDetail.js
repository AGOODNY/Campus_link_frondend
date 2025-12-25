// pages/problemDetail/problemDetail.js
const questionStore = require('../../utils/question')

Page({
  data: {
    isStaff: false,
    question: null,
    replies: [],
    solutionText: '',
    solutionImages: [],
    statusMap: {
      pending: 'Pending',
      reported: 'Accepted',
      solved: 'Resolved'
    }
  },

  onLoad(options) {
    const id = Number(options.id)
    const question = questionStore.getQuestionById(id)

    if (question) {
      this.setData({
        question,
        replies: question.replies || []
      })
    }
  },

  submitReply(e) {
    const content = e.detail.value.reply
    if (!content) return

    const reply = {
      id: Date.now(),
      staffName: 'Staff',
      content,
      time: new Date().toLocaleString()
    }

    questionStore.addReply(this.data.question.id, reply)

    const question = questionStore.getQuestionById(this.data.question.id)

    this.setData({
      question,
      replies: question.replies
    })
  },

  submitSolution() {
    if (!this.data.solutionText) {
      wx.showToast({ title: 'Please enter a solution description', icon: 'none' })
      return
    }

    questionStore.solveQuestion(this.data.question.id, {
      description: this.data.solutionText,
      images: this.data.solutionImages
    })

    const question = questionStore.getQuestionById(this.data.question.id)

    this.setData({ question })

    wx.showToast({ title: 'The problem has been resolved' })
  }
})
