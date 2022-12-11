import request from '@/utils/request'

// 查询系统配置列表
export function listConf(query) {
  return request({
    url: '/conf/conf/list',
    method: 'get',
    params: query
  })
}

// 查询系统配置详细
export function getConf(confId) {
  return request({
    url: '/conf/conf/' + confId,
    method: 'get'
  })
}

// 新增系统配置
export function addConf(data) {
  return request({
    url: '/conf/conf',
    method: 'post',
    data: data
  })
}

// 修改系统配置
export function updateConf(data) {
  return request({
    url: '/conf/conf',
    method: 'put',
    data: data
  })
}

// 删除系统配置
export function delConf(confId) {
  return request({
    url: '/conf/conf/' + confId,
    method: 'delete'
  })
}

// 导出系统配置
export function exportConf(query) {
  return request({
    url: '/conf/conf/export',
    method: 'get',
    params: query
  })
}