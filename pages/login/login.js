const { apiLogin } = require('../../utils/util.js')

Page({
  data: { username: '', password: '' },

  onUsername(e) {
    console.log('Username input:', e.detail.value)
    this.setData({ username: e.detail.value })
  },
  
  onPassword(e) {
    console.log('Password input:', e.detail.value ? 'Entered (hidden)' : 'Empty')
    this.setData({ password: e.detail.value })
  },

  login() {
    console.log('=== Login process started ===')
    const { username, password } = this.data
    console.log('Login parameters - Username:', username, 'Password length:', password.length)
    
    // Parameter validation
    if (!username.trim() || !password.trim()) {
      console.error('Login failed: Username or password is empty')
      wx.showToast({
        title: 'Please enter username and password',
        icon: 'none'
      })
      return
    }
    
    console.log('Calling apiLogin function...')
    apiLogin(username, password)
      .then((response) => {
        console.log('Login successful - API response:', response)
        console.log('Preparing to jump to homepage...')
        
        wx.switchTab({ 
          url: '/pages/life/life' 
        })
      })
      .catch(err => {
        console.error('Login failed - Error details:', err)
        console.error('Error type:', typeof err)
        console.error('Error message:', err.message || 'No error message')
        console.error('Complete error object:', err)
        
        // Display more detailed error information
        let errorMsg = 'Login failed'
        if (err && err.message) {
          errorMsg = err.message
        } else if (err && err.errMsg) {
          errorMsg = err.errMsg
        } else if (typeof err === 'string') {
          errorMsg = err
        }
        
        wx.showToast({
          title: errorMsg,
          icon: 'none',
          duration: 3000
        })
      })
  },
  
  gotoRegister() {
    console.log('Redirecting to registration page')
    wx.redirectTo({ url: '/pages/register/register' })
  },

  // Add page lifecycle logs
  onLoad() {
    console.log('Login page loaded')
  },
  
  onShow() {
    console.log('Login page shown')
  }
})