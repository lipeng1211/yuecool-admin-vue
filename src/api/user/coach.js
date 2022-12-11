import request from '@/utils/request'

// 查询教练列表
export function listCoach(query) {
  return request({
    url: '/user/coach/list',
    method: 'get',
    params: query
  })
}

// 查询教练详细
export function getCoach(id) {
  return request({
    url: '/user/coach/' + id,
    method: 'get'
  })
}

// 新增教练
export function addCoach(data) {
  return request({
    url: '/user/coach',
    method: 'post',
    data: data
  })
}

// 修改教练
export function updateCoach(data) {
  return request({
    url: '/user/coach',
    method: 'put',
    data: data
  })
}

// 删除教练
export function delCoach(id) {
  return request({
    url: '/user/coach/' + id,
    method: 'delete'
  })
}

// 导出教练
export function exportCoach(query) {
  return request({
    url: '/user/coach/export',
    method: 'get',
    params: query
  })
}