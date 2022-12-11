import request from '@/utils/request'

// 查询轮播图列表
export function listDiagram1(query) {
  return request({
    url: '/system/diagram1/list',
    method: 'get',
    params: query
  })
}

// 查询轮播图详细
export function getDiagram1(id) {
  return request({
    url: '/system/diagram1/' + id,
    method: 'get'
  })
}

// 新增轮播图
export function addDiagram1(data) {
  return request({
    url: '/system/diagram1',
    method: 'post',
    data: data
  })
}

// 修改轮播图
export function updateDiagram1(data) {
  return request({
    url: '/system/diagram1',
    method: 'put',
    data: data
  })
}

// 删除轮播图
export function delDiagram1(id) {
  return request({
    url: '/system/diagram1/' + id,
    method: 'delete'
  })
}

// 导出轮播图
export function exportDiagram1(query) {
  return request({
    url: '/system/diagram1/export',
    method: 'get',
    params: query
  })
}