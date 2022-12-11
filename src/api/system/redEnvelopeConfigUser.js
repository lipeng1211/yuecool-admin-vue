import request from '@/utils/request'

// 查询红包个人配置列表
export function listRedEnvelopeConfigUser(query) {
  return request({
    url: '/system/redEnvelopeConfigUser/list',
    method: 'get',
    params: query
  })
}

// 查询红包个人配置详细
export function getRedEnvelopeConfigUser(id) {
  return request({
    url: '/system/redEnvelopeConfigUser/' + id,
    method: 'get'
  })
}

// 新增红包个人配置
export function addRedEnvelopeConfigUser(data) {
  return request({
    url: '/system/redEnvelopeConfigUser',
    method: 'post',
    data: data
  })
}

// 修改红包个人配置
export function updateRedEnvelopeConfigUser(data) {
  return request({
    url: '/system/redEnvelopeConfigUser',
    method: 'put',
    data: data
  })
}

// 删除红包个人配置
export function delRedEnvelopeConfigUser(id) {
  return request({
    url: '/system/redEnvelopeConfigUser/' + id,
    method: 'delete'
  })
}

// 导出红包个人配置
export function exportRedEnvelopeConfigUser(query) {
  return request({
    url: '/system/redEnvelopeConfigUser/export',
    method: 'get',
    params: query
  })
}