import request from '@/utils/request'

// 查询渠道配置列表
export function listPlaceConfig(query) {
  return request({
    url: '/system/placeConfig/list',
    method: 'get',
    params: query
  })
}

// 查询渠道配置详细
export function getPlaceConfig(id) {
  return request({
    url: '/system/placeConfig/' + id,
    method: 'get'
  })
}

// 新增渠道配置
export function addPlaceConfig(data) {
  return request({
    url: '/system/placeConfig',
    method: 'post',
    data: data
  })
}

// 修改渠道配置
export function updatePlaceConfig(data) {
  return request({
    url: '/system/placeConfig',
    method: 'put',
    data: data
  })
}

// 删除渠道配置
export function delPlaceConfig(id) {
  return request({
    url: '/system/placeConfig/' + id,
    method: 'delete'
  })
}

// 导出渠道配置
export function exportPlaceConfig(query) {
  return request({
    url: '/system/placeConfig/export',
    method: 'get',
    params: query
  })
}
