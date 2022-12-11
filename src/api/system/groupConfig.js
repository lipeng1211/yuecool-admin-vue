import request from '@/utils/request'

// 查询群参数配置列表
export function listGroupConfig(query) {
  return request({
    url: '/system/groupConfig/list',
    method: 'get',
    params: query
  })
}

// 查询群参数配置详细
export function getGroupConfig(configKey) {
  return request({
    url: '/system/groupConfig/' + configKey,
    method: 'get'
  })
}

// 新增群参数配置
export function addGroupConfig(data) {
  return request({
    url: '/system/groupConfig',
    method: 'post',
    data: data
  })
}

// 修改群参数配置
export function updateGroupConfig(data) {
  return request({
    url: '/system/groupConfig',
    method: 'put',
    data: data
  })
}

// 删除群参数配置
export function delGroupConfig(configKey) {
  return request({
    url: '/system/groupConfig/' + configKey,
    method: 'delete'
  })
}

// 导出群参数配置
export function exportGroupConfig(query) {
  return request({
    url: '/system/groupConfig/export',
    method: 'get',
    params: query
  })
}