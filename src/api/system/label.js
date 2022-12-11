import request from '@/utils/request'

// 查询患者评价列表
export function listLabel(query) {
  return request({
    url: '/system/label/list',
    method: 'get',
    params: query
  })
}

// 查询患者评价详细
export function getLabel(id) {
  return request({
    url: '/system/label/' + id,
    method: 'get'
  })
}

// 新增患者评价
export function addLabel(data) {
  return request({
    url: '/system/label',
    method: 'post',
    data: data
  })
}

// 修改患者评价
export function updateLabel(data) {
  return request({
    url: '/system/label',
    method: 'put',
    data: data
  })
}

// 删除患者评价
export function delLabel(id) {
  return request({
    url: '/system/label/' + id,
    method: 'delete'
  })
}

// 导出患者评价
export function exportLabel(query) {
  return request({
    url: '/system/label/export',
    method: 'get',
    params: query
  })
}