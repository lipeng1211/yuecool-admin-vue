import request from '@/utils/request'

// 查询活动报名列表
export function listRegistration(query) {
  return request({
    url: '/system/registration/list',
    method: 'get',
    params: query
  })
}

// 查询活动报名详细
export function getRegistration(activitiesId) {
  return request({
    url: '/system/registration/' + activitiesId,
    method: 'get'
  })
}

// 新增活动报名
export function addRegistration(data) {
  return request({
    url: '/system/registration',
    method: 'post',
    data: data
  })
}

// 修改活动报名
export function updateRegistration(data) {
  return request({
    url: '/system/registration',
    method: 'put',
    data: data
  })
}

// 删除活动报名
export function delRegistration(activitiesId) {
  return request({
    url: '/system/registration/' + activitiesId,
    method: 'delete'
  })
}

// 导出活动报名
export function exportRegistration(query) {
  return request({
    url: '/system/registration/export',
    method: 'get',
    params: query
  })
}