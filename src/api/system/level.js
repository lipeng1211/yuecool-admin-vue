import request from '@/utils/request'

// 查询用户等级列表
export function listLevel(query) {
  return request({
    url: '/system/level/list',
    method: 'get',
    params: query
  })
}

// 查询用户等级详细
export function getLevel(id) {
  return request({
    url: '/system/level/' + id,
    method: 'get'
  })
}

// 新增用户等级
export function addLevel(data) {
  return request({
    url: '/system/level',
    method: 'post',
    data: data
  })
}

// 修改用户等级
export function updateLevel(data) {
  return request({
    url: '/system/level',
    method: 'put',
    data: data
  })
}

// 删除用户等级
export function delLevel(id) {
  return request({
    url: '/system/level/' + id,
    method: 'delete'
  })
}

// 导出用户等级
export function exportLevel(query) {
  return request({
    url: '/system/level/export',
    method: 'get',
    params: query
  })
}