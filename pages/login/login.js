const { wechatLogin } = require('../../utils/util.js') 
Page(
  { onShow() {
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
          animation: false }) 
        }, 
        data: {
        role:'',
        userInfo: null }, 
//Choose identity
     onRoleChange(e) {
        this.setData({
           role: e.detail.value 
          })
         }, 
         
 //Log in 
    wechatLogin() 
    { const { role } = this.data
     if (!role) {
        wx.showToast({
          title: 'Choose your role first!',
          icon: 'none'
         }) 
         return 
        } 
    wechatLogin(role)
     .then(data => { 
       this.setData({ 
         userInfo: data.userInfo 
        })
     wx.switchTab({
        url: '/pages/compous_index/compous_index' 
      }) 
    }) 
    .catch(err => {
       wx.showToast({
          title: 'Login failed', 
          icon: 'none' 
        }) 
        console.error(err)
       }) 
      } 
    })