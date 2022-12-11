import request from '@/utils/request'

// 查询短号分类列表
export function listNumberCategory(query) {
  return request({
    url: '/system/numberCategory/list',
    method: 'get',
    params: query
  })
}

// 查询短号分类详细
export function getNumberCategory(id) {
  return request({
    url: '/system/numberCategory/' + id,
    method: 'get'
  })
}

// 新增短号分类
export function addNumberCategory(data) {
  return request({
    url: '/system/numberCategory',
    method: 'post',
    data: data
  })
}

// 修改短号分类
export function updateNumberCategory(data) {
  return request({
    url: '/system/numberCategory',
    method: 'put',
    data: data
  })
}

// 删除短号分类
export function delNumberCategory(id) {
  return request({
    url: '/system/numberCategory/' + id,
    method: 'delete'
  })
}

// 导出短号分类
export function exportNumberCategory(query) {
  return request({
    url: '/system/numberCategory/export',
    method: 'get',
    params: query
  })
}