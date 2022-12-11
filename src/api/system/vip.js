import request from '@/utils/request'

// 查询用户会员列列表
export function listVip(query) {
  return request({
    url: '/system/vip/list',
    method: 'get',
    params: query
  })
}

// 查询用户会员列详细
export function getVip(id) {
  return request({
    url: '/system/vip/' + id,
    method: 'get'
  })
}

// 新增用户会员列
export function addVip(data) {
  return request({
    url: '/system/vip',
    method: 'post',
    data: data
  })
}

// 修改用户会员列
export function updateVip(data) {
  return request({
    url: '/system/vip',
    method: 'put',
    data: data
  })
}

// 删除用户会员列
export function delVip(id) {
  return request({
    url: '/system/vip/' + id,
    method: 'delete'
  })
}

// 导出用户会员列
export function exportVip(query) {
  return request({
    url: '/system/vip/export',
    method: 'get',
    params: query
  })
}