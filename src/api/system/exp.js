import request from '@/utils/request'

// 查询购买经验值价格配置列表
export function listValue(query) {
  return request({
    url: '/system/value/list',
    method: 'get',
    params: query
  })
}

// 查询购买经验值价格配置详细
export function getValue(id) {
  return request({
    url: '/system/value/' + id,
    method: 'get'
  })
}

// 新增购买经验值价格配置
export function addValue(data) {
  return request({
    url: '/system/value',
    method: 'post',
    data: data
  })
}

// 修改购买经验值价格配置
export function updateValue(data) {
  return request({
    url: '/system/value',
    method: 'put',
    data: data
  })
}

// 删除购买经验值价格配置
export function delValue(id) {
  return request({
    url: '/system/value/' + id,
    method: 'delete'
  })
}

// 导出购买经验值价格配置
export function exportValue(query) {
  return request({
    url: '/system/value/export',
    method: 'get',
    params: query
  })
}