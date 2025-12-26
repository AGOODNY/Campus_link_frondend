// pages/problem/problem.js
const api = require('../../utils/question')

Page({
  data: {
    questionList: []
  },

  onShow() {
    api.fetchIssueList().then(list => {
      this.setData({ questionList: list })
    }).catch(err => {
      console.error("Fail to get problem lists.", err)
    })
  },

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
