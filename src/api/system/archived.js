import request from '@/utils/request'

// 查询用户聊天记录（存档）。超时后的用户聊天记录，将自动转储到本，防止用户的消息记录热数据过
export function listArchived(query) {
  return request({
    url: '/messageList/message/list',
    method: 'get',
    params: query
  })
}

// 查询用户聊天记录（存档）。超时后的用户聊天记录，将自动转储到本，防止用户的消息记录热数据过
export function getArchived(collectId) {
  return request({
    url: '/messageList/message/' + collectId,
    method: 'get'
  })
}

// 新增用户聊天记录（存档）。超时后的用户聊天记录，将自动转储到本，防止用户的消息记录热数据过
export function addArchived(data) {
  return request({
    url: '/system/message',
    method: 'post',
    data: data
  })
}

// 修改用户聊天记录（存档）。超时后的用户聊天记录，将自动转储到本，防止用户的消息记录热数据过

export function updateArchived(data) {
  return request({
    url: '/messageList/message',
    method: 'put',
    data: data
  })
}

// 删除用户聊天记录（存档）。超时后的用户聊天记录，将自动转储到本，防止用户的消息记录热数据过
export function delArchived(collectId) {
  return request({
    url: '/messageList/message/' + collectId,
    method: 'delete'
  })
}

// 导出用户聊天记录（存档）。超时后的用户聊天记录，将自动转储到本，防止用户的消息记录热数据过
export function exportArchived(query) {
  return request({
    url: '/messageList/message/export',
    method: 'get',
    params: query
  })
}