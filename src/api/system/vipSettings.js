import request from '@/utils/request'

// 查询个人设置列表
export function listVipSettings(query) {
  return request({
    url: '/system/vipSettings/list',
    method: 'get',
    params: query
  })
}

// 查询个人设置详细
export function getVipSettings(userId) {
  return request({
    url: '/system/vipSettings/' + userId,
    method: 'get'
  })
}

// 新增个人设置
export function addVipSettings(data) {
  return request({
    url: '/system/vipSettings',
    method: 'post',
    data: data
  })
}

// 修改个人设置
export function updateVipSettings(data) {
  return request({
    url: '/system/vipSettings',
    method: 'put',
    data: data
  })
}

// 删除个人设置
export function delVipSettings(userId) {
  return request({
    url: '/system/vipSettings/' + userId,
    method: 'delete'
  })
}

// 导出个人设置
export function exportVipSettings(query) {
  return request({
    url: '/system/vipSettings/export',
    method: 'get',
    params: query
  })
}