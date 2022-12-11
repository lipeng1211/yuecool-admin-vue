import request from '@/utils/request'

// 查询会员分类列表
export function listVipCategory(query) {
  return request({
    url: '/system/vipCategory/list',
    method: 'get',
    params: query
  })
}

// 查询会员分类详细
export function getVipCategory(id) {
  return request({
    url: '/system/vipCategory/' + id,
    method: 'get'
  })
}

// 新增会员分类
export function addVipCategory(data) {
  return request({
    url: '/system/vipCategory',
    method: 'post',
    data: data
  })
}

// 修改会员分类
export function updateVipCategory(data) {
  return request({
    url: '/system/vipCategory',
    method: 'put',
    data: data
  })
}

// 删除会员分类
export function delVipCategory(id) {
  return request({
    url: '/system/vipCategory/' + id,
    method: 'delete'
  })
}

// 导出会员分类
export function exportVipCategory(query) {
  return request({
    url: '/system/vipCategory/export',
    method: 'get',
    params: query
  })
}