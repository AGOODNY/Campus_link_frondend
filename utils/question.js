// utils/question.js
const STORAGE_KEY = 'questionList'

/**
 * 初始化问题（第一次进入用）
 */
function initQuestions() {
  const list = wx.getStorageSync(STORAGE_KEY)
  if (!list || !list.length) {
    const mock = [
      {
        id: 1,
        avatar: '/pages/problem/avatar/a1.jpg',
        nickname: 'Lee',
        content: 'The dormitory internet often disconnects at night, affecting my studies.',
        images: [],
        status: 'pending',
        createTime: '2025-01-18 21:30',
        replies: [],
        solution: null
      },
      {
        id: 2,
        avatar: '/pages/problem/avatar/a2.jpg',
        nickname: 'Arinota',
        content: 'The classroom projector is not working',
        images: [],
        status: 'reported',
        createTime: '2025-01-19 10:20',
        replies: [
          {
            staffName: 'Logistics Teacher',
            time: '2025-01-19 10:25',
            content: 'The logistics teacher has already reported back to the logistics department.'
          }
        ],
        solution: null
      },
      {
        id: 3,
        avatar: '/pages/problem/avatar/a3.jpg',
        nickname: 'LNY',
        content: 'Why is my takeout always getting stolen?。',
        images: ['/pages/problem/images/1.jpg'],
        status: 'solved',
        createTime: '2025-01-19 10:20',
        replies: [
          {
            staffName: 'Logistics Teacher',
            time: '2025-01-19 10:25',
            content: 'It has been reported to logistics.'
          }
        ],
        solution: {
          description: 'Monitoring has been installed and patrols have been strengthened.',
          images: []
        }
      }
    ]

    wx.setStorageSync(STORAGE_KEY, mock)
    return mock
  }
  return list
}

/**
 * 获取所有问题
 */
function getAllQuestions() {
  return wx.getStorageSync(STORAGE_KEY) || []
}

/**
 * 根据 id 获取单个问题
 */
function getQuestionById(id) {
  const list = getAllQuestions()
  return list.find(q => q.id === id)
}

/**
 * 保存整个列表
 */
function saveQuestions(list) {
  wx.setStorageSync(STORAGE_KEY, list)
}

/**
 * 更新单个问题
 */
function updateQuestion(updated) {
  const list = getAllQuestions()
  const index = list.findIndex(q => q.id === updated.id)
  if (index !== -1) {
    list[index] = updated
    saveQuestions(list)
  }
}

/**
 * 添加回复
 */
function addReply(questionId, reply) {
  const question = getQuestionById(questionId)
  if (!question) return

  question.replies.push(reply)

  // pending → reported
  if (question.status === 'pending') {
    question.status = 'reported'
  }

  updateQuestion(question)
}

/**
 * 提交解决方案
 */
function solveQuestion(questionId, solution) {
  const question = getQuestionById(questionId)
  if (!question) return

  question.status = 'solved'
  question.solution = solution

  updateQuestion(question)
}

module.exports = {
  initQuestions,
  getAllQuestions,
  getQuestionById,
  addReply,
  solveQuestion
}
