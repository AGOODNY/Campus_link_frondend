const { apiLogin } = require('../../utils/util.js')

Page({
  data: { username: '', password: '' },

  onUsername(e) { this.setData({ username: e.detail.value }) },
  onPassword(e) { this.setData({ password: e.detail.value }) },

  login() {
    const { username, password } = this.data
    apiLogin(username, password).then(res => {
      wx.switchTab({ url: '/pages/compous_index/compous_index' })
    }).catch(err => {
      wx.showToast({ title: err.message || 'Login failed', icon: 'none' })
    })
  },

  gotoRegister() {
    wx.redirectTo({ url: '/pages/register/register' })
  }
})
