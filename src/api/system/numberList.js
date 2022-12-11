import request from '@/utils/request'

// 查询靓号列表列表
export function listNumberList(query) {
  return request({
    url: '/system/numberList/list',
    method: 'get',
    params: query
  })
}

// 查询短号分类列表
export function shortNumberCategory(query) {
  return request({
    url: '/system/numberCategory/list',
    method: 'get',
    params: query
  })
}

// 查询靓号列表详细
export function getNumberList(id) {
  return request({
    url: '/system/numberList/' + id,
    method: 'get'
  })
}

// 新增靓号列表
export function addNumberList(data) {
  return request({
    url: '/system/numberList',
    method: 'post',
    data: data
  })
}

// 修改靓号列表
export function updateNumberList(data) {
  return request({
    url: '/system/numberList',
    method: 'put',
    data: data
  })
}

// 删除靓号列表
export function delNumberList(id) {
  return request({
    url: '/system/numberList/' + id,
    method: 'delete'
  })
}

// 导出靓号列表
export function exportNumberList(query) {
  return request({
    url: '/system/numberList/export',
    method: 'get',
    params: query
  })
}