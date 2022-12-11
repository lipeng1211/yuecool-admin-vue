import request from '@/utils/request'

// 查询参数配置列表
export function listClientConfig(query) {
  return request({
    url: '/system/clientConfig/list',
    method: 'get',
    params: query
  })
}

// 查询参数配置详细
export function getClientConfig(configKey) {
  return request({
    url: '/system/clientConfig/' + configKey,
    method: 'get'
  })
}

// 新增参数配置
export function addClientConfig(data) {
  return request({
    url: '/system/clientConfig',
    method: 'post',
    data: data
  })
}

// 修改参数配置
export function updateClientConfig(data) {
  return request({
    url: '/system/clientConfig',
    method: 'put',
    data: data
  })
}

// 删除参数配置
export function delClientConfig(configKey) {
  return request({
    url: '/system/clientConfig/' + configKey,
    method: 'delete'
  })
}

// 导出参数配置
export function exportClientConfig(query) {
  return request({
    url: '/system/clientConfig/export',
    method: 'get',
    params: query
  })
}