// pages/post/post.js
const { createPost } = require('../../utils/util')

Page({
  data: {
    sectionIndex: -1,
    lifeSubIndex: -1,

    title: '',
    content: '',
    images: [],

    canSubmit: false
  },

  selectSection(e) {
    const index = Number(e.currentTarget.dataset.index)
    this.setData({
      sectionIndex: index,
      lifeSubIndex: -1,

      title: '',
      content: '',
      images: [],
      canSubmit: false
    })
  },

  selectLifeSub(e) {
    this.setData({
      lifeSubIndex: Number(e.currentTarget.dataset.index)
    })
  },

  onTitleInput(e) {
    this.setData({
      title: e.detail.value
    })
    this.checkCanSubmit()
  },

  onContentInput(e) {
    this.setData({
      content: e.detail.value
    })
    this.checkCanSubmit()
  },

  addImage() {
    wx.chooseImage({
      count: 9 - this.data.images.length,
      success: res => {
        this.setData({
          images: this.data.images.concat(res.tempFilePaths)
        })
        this.checkCanSubmit()
      }
    })
  },

  checkCanSubmit() {
    const { sectionIndex, title, content } = this.data
    if (sectionIndex === -1) return this.setData({ canSubmit: false })

    if (sectionIndex === 2) {
      return this.setData({ canSubmit: !!title && !!content })
    }

    return this.setData({ canSubmit: !!title && !!content })
  },

  submitPost() {
    const token = wx.getStorageSync('token')
    const defaultAvatar = "/images/default_avatar.png"
    const defaultNickname = "Anonymous"

    const avatar = wx.getStorageSync('avatar') || defaultAvatar
    const nickname = wx.getStorageSync('nickname') || defaultNickname

    const { sectionIndex, lifeSubIndex, title, content, images } = this.data
    let postData = {}

    if (sectionIndex === 0) {
      postData = {
        target: 'life',
        title,
        content,
        life_category: lifeSubIndex === 0 ? 'campus_life' : 'return_school',
        imagePath: images.length ? images[0] : "",
        avatar,
        nickname
      }
    }
    
    if (sectionIndex === 1) {
      postData = {
        target: 'study',
        title,
        content,
        imagePath: images.length ? images[0] : "",
        avatar,
        nickname
      }
    }
    
    if (sectionIndex === 2) {
      postData = {
        target: 'issue',
        title,
        description: content,
        imagePath: images.length ? images[0] : "",
        avatar,
        nickname
      }
    }
    

    createPost(postData)
      .then(() => {
        wx.showToast({ title: 'Success', icon: 'success' })
        setTimeout(() => wx.navigateBack(), 800)
      })
      .catch(err => {
        wx.showToast({ title: 'Fail', icon: 'none' })
        console.error(err)
      })
  }
})
