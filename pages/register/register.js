const { apiRegister } = require('../../utils/util.js')

Page({
  data: { username: '', password: '', role: '' },

  onUsername(e) { this.setData({ username: e.detail.value }) },
  onPassword(e) { this.setData({ password: e.detail.value }) },
  onRoleChange(e) { this.setData({ role: e.detail.value }) },

  register() {
    const { username, password, role } = this.data
    if (!username || !password || !role) {
      wx.showToast({ title: 'Fill all fields', icon: 'none' })
      return
    }

    apiRegister(username, password, role).then(() => {
      wx.showToast({ title: 'Registered' })
      wx.redirectTo({ url: '/pages/login/login' })
    }).catch(err => {
      wx.showToast({ title: err.message || 'Failed', icon: 'none' })
    })
  },

  gotoLogin() {
    wx.redirectTo({ url: '/pages/login/login' })
  }
})
