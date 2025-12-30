const { apiLogin } = require('../../utils/util.js')

Page({
  data: { username: '', password: '' },

  onUsername(e) {
    this.setData({ username: e.detail.value })
  },
  
  onPassword(e) {
    this.setData({ password: e.detail.value })
  },

  login() {
    const { username, password } = this.data
  
    // 参数验证
    if (!username.trim() || !password.trim()) {
      wx.showToast({
        title: 'Please enter your username and password',
        icon: 'none'
      })
      return
    }
    
    apiLogin(username, password)
      .then((response) => {
        wx.switchTab({ 
          url: '/pages/setting/setting' 
        })
      })
      .catch(err => {
        wx.showToast({
          title: 'Login failed',
          icon: 'none'
        })
      })
  },
  
  gotoRegister() {
    wx.redirectTo({ url: '/pages/register/register' })
  }
})