import request from '@/utils/request'

// 查询评分列表
export function listAppraisals(query) {
  return request({
    url: '/system/appraisals/list',
    method: 'get',
    params: query
  })
}

// 查询评分详细
export function getAppraisals(id) {
  return request({
    url: '/system/appraisals/' + id,
    method: 'get'
  })
}

// 新增评分
export function addAppraisals(data) {
  return request({
    url: '/system/appraisals',
    method: 'post',
    data: data
  })
}

// 修改评分
export function updateAppraisals(data) {
  return request({
    url: '/system/appraisals',
    method: 'put',
    data: data
  })
}

// 删除评分
export function delAppraisals(id) {
  return request({
    url: '/system/appraisals/' + id,
    method: 'delete'
  })
}

// 导出评分
export function exportAppraisals(query) {
  return request({
    url: '/system/appraisals/export',
    method: 'get',
    params: query
  })
}