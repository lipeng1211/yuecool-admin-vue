import request from '@/utils/request'

// 查询充值位置配置列表
export function listLocationConfig(query) {
  return request({
    url: '/user/locationConfig/list',
    method: 'get',
    params: query
  })
}

// 查询充值位置配置详细
export function getLocationConfig(id) {
  return request({
    url: '/user/locationConfig/' + id,
    method: 'get'
  })
}

// 新增充值位置配置
export function addLocationConfig(data) {
  return request({
    url: '/user/locationConfig',
    method: 'post',
    data: data
  })
}

// 修改充值位置配置
export function updateLocationConfig(data) {
  return request({
    url: '/user/locationConfig',
    method: 'put',
    data: data
  })
}

// 删除充值位置配置
export function delLocationConfig(id) {
  return request({
    url: '/user/locationConfig/' + id,
    method: 'delete'
  })
}

// 导出充值位置配置
export function exportLocationConfig(query) {
  return request({
    url: '/user/locationConfig/export',
    method: 'get',
    params: query
  })
}