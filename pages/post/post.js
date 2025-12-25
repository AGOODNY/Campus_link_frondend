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

  /* 选择主分区 */
  selectSection(e) {
    const index = Number(e.currentTarget.dataset.index)

    this.setData({
      sectionIndex: index,
      lifeSubIndex: -1,

      //  切换分区时清空不需要的字段
      title: index === 2 ? '' : this.data.title,
      content: '',
      images: [],

      canSubmit: false
    })
  },

  /* 选择生活区子分区 */
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

  /* 是否允许发布 */
  checkCanSubmit() {
    const { sectionIndex, title, content } = this.data

    if (sectionIndex === -1) {
      this.setData({ canSubmit: false })
      return
    }

    // 问题反馈
    if (sectionIndex === 2) {
      this.setData({
        canSubmit: !!content
      })
      return
    }

    // 生活区 / 学习区
    this.setData({
      canSubmit: !!title && !!content
    })
  },

  submitPost() {
    const {
      sectionIndex,
      lifeSubIndex,
      title,
      content,
      images
    } = this.data
  
    let postData = {}
  
    // 生活区
    if (sectionIndex === 0) {
      postData = {
        target: 'life',
        title,
        content,
        life_category: lifeSubIndex === 0 ? 'campus_life' : 'return_school',
        images
      }
    }
  
    // 学习区
    if (sectionIndex === 1) {
      postData = {
        target: 'study',
        title,
        content,
        images
      }
    }
  
    // 问题追踪
    if (sectionIndex === 2) {
      postData = {
        target: 'issue',
        title,
        description: content,
        images
      }
    }
  
    createPost(postData)
      .then(res => {
        wx.showToast({
          title: 'Success',
          icon: 'success'
        })
  
        // 发布成功后返回
        setTimeout(() => {
          wx.navigateBack()
        }, 800)
      })
      .catch(err => {
        wx.showToast({
          title: 'Fail',
          icon: 'none'
        })
        console.error(err)
      })
  }
  
})
