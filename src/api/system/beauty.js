import request from '@/utils/request'

// 查询用户美颜设置信息列表
export function listBeauty(query) {
  return request({
    url: '/system/beauty/list',
    method: 'get',
    params: query
  })
}

// 查询用户美颜设置信息详细
export function getBeauty(id) {
  return request({
    url: '/system/beauty/' + id,
    method: 'get'
  })
}

// 新增用户美颜设置信息
export function addBeauty(data) {
  return request({
    url: '/system/beauty',
    method: 'post',
    data: data
  })
}

// 修改用户美颜设置信息
export function updateBeauty(data) {
  return request({
    url: '/system/beauty',
    method: 'put',
    data: data
  })
}

// 删除用户美颜设置信息
export function delBeauty(id) {
  return request({
    url: '/system/beauty/' + id,
    method: 'delete'
  })
}

// 导出用户美颜设置信息
export function exportBeauty(query) {
  return request({
    url: '/system/beauty/export',
    method: 'get',
    params: query
  })
}