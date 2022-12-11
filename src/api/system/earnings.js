import request from '@/utils/request'

// 查询上榜收益	列表
export function listEarnings(query) {
  return request({
    url: '/system/earnings/list',
    method: 'get',
    params: query
  })
}

// 查询上榜收益	详细
export function getEarnings(id) {
  return request({
    url: '/system/earnings/' + id,
    method: 'get'
  })
}

// 新增上榜收益	
export function addEarnings(data) {
  return request({
    url: '/system/earnings',
    method: 'post',
    data: data
  })
}

// 修改上榜收益	
export function updateEarnings(data) {
  return request({
    url: '/system/earnings',
    method: 'put',
    data: data
  })
}

// 删除上榜收益	
export function delEarnings(id) {
  return request({
    url: '/system/earnings/' + id,
    method: 'delete'
  })
}

// 导出上榜收益	
export function exportEarnings(query) {
  return request({
    url: '/system/earnings/export',
    method: 'get',
    params: query
  })
}