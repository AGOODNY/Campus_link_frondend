const api = require('../../utils/question')

Page({
  data: {
    questionList: []
  },

  onShow() {
    api.fetchIssueList().then(list => {
      // 过滤只显示当前学生提交过的问题
      const myId = wx.getStorageSync("user_id");
      this.setData({ questionList: list.filter(q => q.creator_id === myId) })
    })
  },

  /* 跳转我的问题 */
  goMyQuestion() {
    wx.navigateTo({
      url: '/pages/myProblem/myProblem'
    })
  },

  /* 跳转问题详情 */
  goDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/problemDetail/problemDetail?id=${id}`
    })
  }
})