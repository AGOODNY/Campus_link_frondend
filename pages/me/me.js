// pages/me/me.js
const { fetchMe } = require('../../utils/util')

Page({
  data: {
    photo: "/images/default.jpg",
    username: "A_Guest"
  },

  onShow() {
    fetchMe()
      .then(res => {
        this.setData({
          photo: res.avatar_url || "/images/default.jpg",
          username: res.nickname || res.username
        })
      })
      .catch(() => {
        wx.showToast({
          title: 'Failed to load user info',
          icon: 'none'
        })
      })
  },

  goMyPost() {
    wx.navigateTo({
      url: "/pages/myPost/myPost"
    })
  },

  goHistory() {
    wx.navigateTo({
      url: "/pages/history/history"
    })
  },

  goSetting() {
    wx.navigateTo({
      url: "/pages/setting/setting"
    })
  }
})
