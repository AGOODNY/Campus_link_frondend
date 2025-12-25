// pages/post/post.js
const questionStore = require('../../utils/question')

Page({
  data: {
    questionList: []
  },

  onLoad() {
    const list = questionStore.initQuestions()
    this.setData({
      questionList: list
    })
  },

  onShow() {
    this.setData({
      questionList: questionStore.getAllQuestions()
    })
  },

  /* 跳转我的问题 */
  goMyQuestion() {
    wx.navigateTo({
      url: '/pages/myProblem/myProblem'
    })
  },
  
  goDetail(e) {
    wx.navigateTo({
      url: `/pages/problemDetail/problemDetail?id=${e.currentTarget.dataset.id}`
    })
  }
})

  
