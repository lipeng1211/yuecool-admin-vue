import request from '@/utils/request'

// 查询红包群配置列表
export function listRedEnvelopeConfigGroup(query) {
  return request({
    url: '/system/redEnvelopeConfigGroup/list',
    method: 'get',
    params: query
  })
}

// 查询红包群配置详细
export function getRedEnvelopeConfigGroup(id) {
  return request({
    url: '/system/redEnvelopeConfigGroup/' + id,
    method: 'get'
  })
}

// 新增红包群配置
export function addRedEnvelopeConfigGroup(data) {
  return request({
    url: '/system/redEnvelopeConfigGroup',
    method: 'post',
    data: data
  })
}

// 修改红包群配置
export function updateRedEnvelopeConfigGroup(data) {
  return request({
    url: '/system/redEnvelopeConfigGroup',
    method: 'put',
    data: data
  })
}

// 删除红包群配置
export function delRedEnvelopeConfigGroup(id) {
  return request({
    url: '/system/redEnvelopeConfigGroup/' + id,
    method: 'delete'
  })
}

// 导出红包群配置
export function exportRedEnvelopeConfigGroup(query) {
  return request({
    url: '/system/redEnvelopeConfigGroup/export',
    method: 'get',
    params: query
  })
}