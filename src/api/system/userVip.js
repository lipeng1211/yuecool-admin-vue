import request from '@/utils/request'

// 查询用户会员列列表
export function listUserVip(query) {
  return request({
    url: '/system/userVip/list',
    method: 'get',
    params: query
  })
}

// 查询用户会员列详细
export function getUserVip(id) {
  return request({
    url: '/system/userVip/' + id,
    method: 'get'
  })
}

// 新增用户会员列
export function addUserVip(data) {
  return request({
    url: '/system/userVip',
    method: 'post',
    data: data
  })
}

// 修改用户会员列
export function updateUserVip(data) {
  return request({
    url: '/system/userVip',
    method: 'put',
    data: data
  })
}

// 删除用户会员列
export function delUserVip(id) {
  return request({
    url: '/system/userVip/' + id,
    method: 'delete'
  })
}

// 导出用户会员列
export function exportUserVip(query) {
  return request({
    url: '/system/userVip/export',
    method: 'get',
    params: query
  })
}