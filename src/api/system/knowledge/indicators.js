import request from '@/utils/request'

// 查询轮播管理列表
export function listIndicators(query) {
  return request({
    url: '/system/indicators/list',
    method: 'get',
    params: query
  })
}

// 查询轮播管理详细
export function getIndicators(id) {
  return request({
    url: '/system/indicators/' + id,
    method: 'get'
  })
}

// 新增轮播管理
export function addIndicators(data) {
  return request({
    url: '/system/indicators',
    method: 'post',
    data: data
  })
}

// 修改轮播管理
export function updateIndicators(data) {
  return request({
    url: '/system/indicators',
    method: 'put',
    data: data
  })
}

// 删除轮播管理
export function delIndicators(id) {
  return request({
    url: '/system/indicators/' + id,
    method: 'delete'
  })
}

// 导出轮播管理
export function exportIndicators(query) {
  return request({
    url: '/system/indicators/export',
    method: 'get',
    params: query
  })
}