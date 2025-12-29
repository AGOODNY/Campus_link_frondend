/**********************
 * 基础工具函数
 **********************/
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${
    [hour, minute, second].map(formatNumber).join(':')
  }`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

/**********************
 * 基础配置
 **********************/
const BASE_URL = 'http://172.20.10.3:8000/api'   // API 基础地址
const BASE_MEDIA_URL = 'http://172.20.10.3:8000' // 媒体文件基础地址（不包含 /api）

/**********************
 * 登录态管理（关键）
 **********************/

/**
 * 保存登录信息
 * 后端返回结构：
 */
const saveLoginInfo = (loginResp) => {
  if (!loginResp || !loginResp.data || !loginResp.data.token) {
    console.error('登录返回数据不完整', loginResp)
    return
  }

  wx.setStorageSync('token', loginResp.data.token)
  wx.setStorageSync('role', loginResp.data.role)
  wx.setStorageSync('is_staff', loginResp.data.is_staff)
}

/**
 * 获取 token
 */
const getToken = () => {
  return wx.getStorageSync('token') || ''
}

/**
 * 生成带 token 的请求头
 */
const authHeader = () => {
  const token = getToken()
  return token ? { 'Authorization': 'Token ' + token } : {}
}

/**********************
 * 接口层
 **********************/

/**
 * 获取帖子列表
 */
const fetchPostList = (params) => {
  const { postType = 'life', ...query } = params

  return new Promise((resolve, reject) => {
    wx.request({
      url: `${BASE_URL}/posts/${postType}/`,
      method: 'GET',
      data: query,
      success(res) { resolve(res.data) },
      fail(err) { reject(err) }
    })
  })
}

/**
 * 获取帖子详情
 */
const fetchPostDetail = (postId) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${BASE_URL}/post/${postId}/`,
      method: 'GET',
      success(res) { resolve(res.data) },
      fail(err) { reject(err) }
    })
  })
}

/**
 * 获取评论列表（comments）
 */
const fetchCommentList = (postId) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${BASE_URL}/post/${postId}/comments/`,
      method: 'GET',
      success(res) { resolve(res.data) },
      fail(err) { reject(err) }
    })
  })
}

/**
 * 发表评论（comment）
 */
const createComment = (postId, content) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${BASE_URL}/post/${postId}/comment/`,
      method: 'POST',
      header: authHeader(),
      data: { content },
      success(res) { resolve(res.data) },
      fail(err) { reject(err) }
    })
  })
}

/**
 * 点赞 / 取消点赞
 */
const toggleLikePost = (postId) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${BASE_URL}/post/${postId}/like/`,
      method: 'POST',
      header: authHeader(),
      success(res) { resolve(res.data) },
      fail(err) { reject(err) }
    })
  })
}


/**
 * 微信登录
 */
const wechatLogin = (role) => {
  return new Promise((resolve, reject) => {
    wx.login({
      success(res) {
        if (!res.code) {
          reject('wx.login failed')
          return
        }

        wx.request({
          url: `${BASE_URL}/login/`,
          method: 'POST',
          data: {
            openid: res.code,
            role: role
          },
          success(resp) {
            //登录成功立刻保存登录态
            saveLoginInfo(resp.data)
            resolve(resp.data)
          },
          fail(err) {
            reject(err)
          }
        })
      },
      fail(err) {
        reject(err)
      }
    })
  })
}

/**
 * 统一发帖接口（最终版 — 支持 study / life / issue，单图上传）
 */
const createPost = (options) => {
  const {
    target,
    title,
    content,
    description,
    life_category,
    imagePath
  } = options

  return new Promise((resolve, reject) => {
    const uploadConfig = {
      url: `${BASE_URL}/posts/`,
      header: {
        'Authorization': 'Token ' + wx.getStorageSync('token')
      },
      formData: {
        target,
        title: title || "",
        content: content || "",
        description: description || "",
        life_category: life_category || ""
      },
      success(res) {
        try {
          resolve(JSON.parse(res.data))
        } catch {
          reject("Invalid response")
        }
      },
      fail(err) {
        reject(err)
      }
    }

    // 只有有图片才加上传文件字段
    if (imagePath) {
      uploadConfig.filePath = imagePath
      uploadConfig.name = "image"
      wx.uploadFile(uploadConfig)
    } else {
      // 无图时转为普通 POST
      wx.request({
        method: "POST",
        ...uploadConfig
      })
    }
  })
}







/**
 * 更新用户头像和昵称
 */
function updateUserProfile({ avatarPath, nickname }) {
  const token = wx.getStorageSync('token')

  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: `${BASE_URL}/me/`,
      filePath: avatarPath,
      name: 'avatar',
      formData: {
        nickname: nickname
      },
      header: {
        Authorization: `Token ${token}`
      },
      success(res) {
        if (res.statusCode !== 200) {
          console.error('Upload failed:', res.data)
          reject(res)
          return
        }
      
        let data
        try {
          data = typeof res.data === 'string'
            ? JSON.parse(res.data)
            : res.data
        } catch (e) {
          console.error('JSON parse error:', res.data)
          reject(e)
          return
        }
        resolve(data)
      },
      fail(err) {
        reject(err)
      }
    })
  })
}

// 获取当前用户信息
function fetchMe() {
  const token = wx.getStorageSync('token')

  return new Promise((resolve, reject) => {
    wx.request({
      url: `${BASE_URL}/me/`,
      method: 'GET',
      header: {
        Authorization: `Token ${token}`
      },
      success(res) {
        if (res.statusCode === 200) {
          resolve(res.data)
        } else {
          reject(res)
        }
      },
      fail(err) {
        reject(err)
      }
    })
  })
}

// 记录浏览行为
function recordPostView(postId) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${BASE_URL}/posts/${postId}/view/`,
      method: 'POST',
      header: {
        'Authorization': 'Token ' + wx.getStorageSync('token')
      },
      success(res) {
        console.log('record view:', res)
        resolve(res)
      },
      fail(err) {
        console.error('record view failed:', err)
        reject(err)
      }
    })
  })
}


//获取浏览记录列表
function fetchViewHistory() {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${BASE_URL}/me/history/`,
      method: 'GET',
      header: {
        'Authorization': 'Token ' + wx.getStorageSync('token')
      },
      success(res) {
        if (res.statusCode === 200) {
          resolve(res.data)
        } else {
          reject(res)
        }
      },
      fail(err) {
        reject(err)
      }
    })
  })
}

// 统一处理 URL
const request = (url, method = "GET", data = {}) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: BASE_URL + (url.startsWith('/') ? url : `/${url}`),  
      method,
      data,
      header: { "Content-Type": "application/json" },
      success: (res) => resolve(res.data),
      fail: reject
    })
  })
}


//  生活区搜索
const searchLife = (keyword) => {
  return request(`/life/search/?q=${encodeURIComponent(keyword)}`)
}

// 学习区搜索
const searchStudy = (keyword) => {
  return request(`/study/search/?q=${encodeURIComponent(keyword)}`)
}

// 图片 URL 兜底函数（统一拼接完整地址）
const normalizeImage = (url) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return BASE_MEDIA_URL + url;
}

/**********************
 * 导出
 **********************/
module.exports = {
  formatTime,

  fetchPostList,
  fetchPostDetail,
  fetchCommentList,
  createComment,
  toggleLikePost,

  wechatLogin,
  saveLoginInfo,
  getToken,

  createPost,
  updateUserProfile,
  fetchMe,
  recordPostView,
  fetchViewHistory,

  searchLife,
  searchStudy,
  normalizeImage
}
