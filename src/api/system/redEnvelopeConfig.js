import request from '@/utils/request'

// 查询红包全局配置列表
export function listRedEnvelopeConfig(query) {
  return request({
    url: '/system/redEnvelopeConfig/list',
    method: 'get',
    params: query
  })
}

// 查询红包全局配置详细
export function getRedEnvelopeConfig(id) {
  return request({
    url: '/system/redEnvelopeConfig/' + id,
    method: 'get'
  })
}

// 新增红包全局配置
export function addRedEnvelopeConfig(data) {
  return request({
    url: '/system/redEnvelopeConfig',
    method: 'post',
    data: data
  })
}

// 修改红包全局配置
export function updateRedEnvelopeConfig(data) {
  return request({
    url: '/system/redEnvelopeConfig',
    method: 'put',
    data: data
  })
}

// 删除红包全局配置
export function delRedEnvelopeConfig(id) {
  return request({
    url: '/system/redEnvelopeConfig/' + id,
    method: 'delete'
  })
}

// 导出红包全局配置
export function exportRedEnvelopeConfig(query) {
  return request({
    url: '/system/redEnvelopeConfig/export',
    method: 'get',
    params: query
  })
}