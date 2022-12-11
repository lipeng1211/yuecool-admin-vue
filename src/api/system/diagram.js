import request from '@/utils/request'

// 查询评分列表
export function listDiagram(query) {
  return request({
    url: '/system/diagram/list',
    method: 'get',
    params: query
  })
}

// 查询评分详细
export function getDiagram(id) {
  return request({
    url: '/system/diagram/' + id,
    method: 'get'
  })
}

// 新增评分
export function addDiagram(data) {
  return request({
    url: '/system/diagram',
    method: 'post',
    data: data
  })
}

// 修改评分
export function updateDiagram(data) {
  return request({
    url: '/system/diagram',
    method: 'put',
    data: data
  })
}

// 删除评分
export function delDiagram(id) {
  return request({
    url: '/system/diagram/' + id,
    method: 'delete'
  })
}

// 导出评分
export function exportDiagram(query) {
  return request({
    url: '/system/diagram/export',
    method: 'get',
    params: query
  })
}