import request from '@/utils/request'

// 查询会员分类列表
export function listCategory(query) {
  return request({
    url: '/system/anchorCategory/list',
    method: 'get',
    params: query
  })
}

// 查询会员分类详细
export function getCategory(id) {
  return request({
    url: '/system/anchorCategory/' + id,
    method: 'get'
  })
}

// 新增会员分类
export function addCategory(data) {
  return request({
    url: '/system/anchorCategory',
    method: 'post',
    data: data
  })
}

// 修改会员分类
export function updateCategory(data) {
  return request({
    url: '/system/anchorCategory',
    method: 'put',
    data: data
  })
}

// 删除会员分类
export function delCategory(id) {
  return request({
    url: '/system/anchorCategory/' + id,
    method: 'delete'
  })
}

// 导出会员分类
export function exportCategory(query) {
  return request({
    url: '/system/anchorCategory/export',
    method: 'get',
    params: query
  })
}