// pages/setting/setting.js
const { updateUserProfile } = require('../../utils/util')
Page({
  data: {
    photo:"/images/default.jpg",
    username:"A_Guest"
  },

  onLoad() {
    const userInfo = wx.getStorageSync('editUserInfo')
    if (userInfo) {
      this.setData({
        photo: userInfo.photo || this.data.photo,
        username: userInfo.username || "A_Guest"
      })
    }
  },

  choosePhoto(event) {
    if (event.detail.avatarUrl) {
      console.log(event)
      this.setData({
        photo:event.detail.avatarUrl
      })
    }
  },

  showName(event) {
    this.setData({
      username: event.detail.value
    })
  },

  onSave() {
    const { photo, username } = this.data
  
    if (!photo || !username) {
      wx.showToast({
        title: 'Please complete your profile picture and nickname.',
        icon: 'none'
      })
      return
    }
  
    wx.showLoading({ title: 'Saving...' })
  
    updateUserProfile({
      avatarPath: photo,
      nickname: username
    })
      .then(res => {
        // 同步本地用户信息
        wx.setStorageSync('userInfo', {
          avatar: res.avatar,
          nickname: res.nickname
        })
  
        wx.hideLoading()
        wx.showToast({ title: 'Saved successfully' })
  
        wx.switchTab({
          url: "/pages/me/me"
        })
      })
      .catch(() => {
        wx.hideLoading()
        wx.showToast({
          title: 'Save failed',
          icon: 'none'
        })
      })
  },
  
  
  onShow() {
    wx.hideTabBar({
      animation: false // 可选 true/false
    })
  },
  
  onHide() {
    wx.showTabBar({
      animation: false
    })
  },
  
  onUnload() {
    wx.showTabBar({
      animation: false
    })
  }
})