const BASE_URL = 'http://172.20.10.3:8000/api';

function request(url, method = "GET", data = {}) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: BASE_URL + url,
      method,
      data,
      header: { 
        'Authorization': 'Token ' + wx.getStorageSync('token'),
        'Content-Type': 'application/x-www-form-urlencoded'  // 必须加
      },
      success: res => {
        if (res.statusCode === 200 || res.statusCode === 201) resolve(res.data)
        else reject(res.data)
      },
      fail: reject
    })
  })
}

function fetchIssueList() {
  return request('/issues/').then(list =>
    list.map(item => ({
      id: item.id,
      title: item.title,
      content: item.title,
      nickname: item.nickname,
      avatar: item.avatar,
      status: item.status,
      creator_id: item.creator_id,
      createTime: item.created_at
    }))
  )
}

function fetchMyIssueList() {
  return request('/issues/my/').then(list =>
    list.map(item => ({
      id: item.id,
      title: item.title,
      content: item.title,
      nickname: item.nickname,
      avatar: item.avatar,
      status: item.status,
      creator_id: item.creator_id,
      createTime: item.created_at
    }))
  )
}

function fetchIssueDetail(id) {
  return request(`/issues/${id}/`).then(d => ({
    id: d.id,
    title: d.title,
    content: d.description,
    avatar: d.avatar,
    nickname: d.nickname,
    status: d.status,
    images: (d.issue_pic || []).map(img => img.image),
    nodes: (d.nodes || []).map(n => ({
      staffName: n.operator_name,
      content: n.description,
      time: n.created_at,
      image: n.image || null
    }))
  }))
}

// issueId: 问题id
// { node_title, content, imagePath } 
const postNode = (issueId, { node_title, content, imagePath }) => {
  return new Promise((resolve, reject) => {
    const header = {
      Authorization: "Token " + wx.getStorageSync("token"),
      "Content-Type": "application/x-www-form-urlencoded"
    }

    if (imagePath) {
      wx.uploadFile({
        url: `${BASE_URL}/issues/${issueId}/nodes/`,
        filePath: imagePath,
        name: "image",
        formData: { node_title, description: content },
        header,
        success(res) {
          resolve(JSON.parse(res.data))
        },
        fail: reject
      })
    } else {
      wx.request({
        url: `${BASE_URL}/issues/${issueId}/nodes/`,
        method: "POST",
        header,
        data: { node_title, description: content },
        success: res => {
          if (res.statusCode === 201) resolve(res.data)
          else reject(res.data)
        },
        fail: reject
      })
    }
  })
}

module.exports = { fetchIssueList, fetchMyIssueList, fetchIssueDetail, postNode }
