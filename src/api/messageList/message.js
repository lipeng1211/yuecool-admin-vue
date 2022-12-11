import request from '@/utils/request'

// 查询用户聊天消息收集


export function listMessage(query) {
  return request({
    url: '/messageList/message/list',
    method: 'get',
    params: query
  })
}

// 查询用户聊天消息收集

export function getMessage(collectId) {
  return request({
    url: '/messageList/message/' + collectId,
    method: 'get'
  })
}

// 新增用户聊天消息收集

export function addMessage(data) {
  return request({
    url: '/messageList/message',
    method: 'post',
    data: data
  })
}

// 修改用户聊天消息收集

export function updateMessage(data) {
  return request({
    url: '/messageList/message',
    method: 'put',
    data: data
  })
}

// 删除用户聊天消息收集


export function delMessage(collectId) {
  return request({
    url: '/messageList/message/' + collectId,
    method: 'delete'
  })
}

export function delMessageByTime(type) {
  return request({
    url: '/messageList/message/deleteByTime',
    method: 'delete',
    data: type
  })
}

// 导出用户聊天消息收集

export function exportMessage(query) {
  return request({
    url: '/messageList/message/export',
    method: 'get',
    params: query
  })
}
