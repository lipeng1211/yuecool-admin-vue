import request from '@/utils/request'

// 查询群成员列表
export function listGroupMembers(query) {
  return request({
    url: '/group/groupMembers/list',
    method: 'get',
    params: query
  })
}

// 查询群成员详细
export function getGroupMembers(userRecordId) {
  return request({
    url: '/group/groupMembers/' + userRecordId,
    method: 'get'
  })
}

// 新增群成员
export function addGroupMembers(data) {
  return request({
    url: '/group/groupMembers',
    method: 'post',
    data: data
  })
}

// 修改群成员
export function updateGroupMembers(data) {
  return request({
    url: '/group/groupMembers',
    method: 'put',
    data: data
  })
}

// 删除群成员
export function delGroupMembers(userRecordId) {
  return request({
    url: '/group/groupMembers/' + userRecordId,
    method: 'delete'
  })
}

// 导出群成员
export function exportGroupMembers(query) {
  return request({
    url: '/group/groupMembers/export',
    method: 'get',
    params: query
  })
}

// 生成群成员
export function generateUser(query) {
  return request({
    url: '/group/group/generateUser',
    method: 'get',
    params: query
  })
}
