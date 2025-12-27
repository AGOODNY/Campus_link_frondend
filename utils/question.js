const BASE_URL = 'http://172.20.10.3:8000/api';

function request(url, method = "GET", data = {}) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: BASE_URL + url,
      method,
      data,
      header: { 'Authorization': 'Token ' + wx.getStorageSync('token') },
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
    replies: (d.nodes || []).map(n => ({
      name: n.operator_name,
      content: n.description,
      time: n.created_at,
      image: n.image || null
    }))
  }))
}

function postNode(id, payload) {
  return request(`/issues/${id}/nodes/`, "POST", {
    node_title: payload.node_title,
    node_status: payload.node_status,
    description: payload.content
  })
}

module.exports = { fetchIssueList, fetchMyIssueList, fetchIssueDetail, postNode }
