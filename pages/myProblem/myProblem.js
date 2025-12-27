const api = require('../../utils/question')

Page({
  data: {
    questionList: []
  },

  onShow() {
    api.fetchMyIssueList().then(list => {
      this.setData({ questionList: list })
    }).catch(err => {
      console.error("Fail to load my issues", err)
      wx.showToast({ title: 'Load failed', icon: 'none' })
    })
  },

  goDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/problemDetail/problemDetail?id=${id}`
    })
  }
})
