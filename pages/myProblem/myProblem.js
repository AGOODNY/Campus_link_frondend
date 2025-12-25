// pages/myProblem/myProblem.js
Page({
  data: {
    questionList: []
  },

  onLoad() {
    // 模拟数据
    this.setData({
      questionList: [
        {
          id: 1,
          avatar: '/pages/problem/avatar/a1.jpg',
          nickname: 'Lee',
          content: 'The dormitory internet often disconnects at night. Is there any solution?',
          image: ''
        }
      ]
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
