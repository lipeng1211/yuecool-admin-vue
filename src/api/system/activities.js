import request from '@/utils/request'

// 查询线下活动列表
export function listActivities(query) {
  return request({
    url: '/system/activities/list',
    method: 'get',
    params: query
  })
}

// 查询线下活动详细
export function getActivities(id) {
  return request({
    url: '/system/activities/' + id,
    method: 'get'
  })
}

// 新增线下活动
export function addActivities(data) {
  return request({
    url: '/system/activities',
    method: 'post',
    data: data
  })
}

// 修改线下活动
export function updateActivities(data) {
  return request({
    url: '/system/activities',
    method: 'put',
    data: data
  })
}

// 删除线下活动
export function delActivities(id) {
  return request({
    url: '/system/activities/' + id,
    method: 'delete'
  })
}

// 导出线下活动
export function exportActivities(query) {
  return request({
    url: '/system/activities/export',
    method: 'get',
    params: query
  })
}

//上传
export function uploadUrl(form,url) {
  return request({
    url: url,
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: form
  })
}