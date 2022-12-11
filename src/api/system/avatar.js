import request from '@/utils/request'

// 查询本地存储列表
export function listAvatar(query) {
  return request({
    url: '/system/avatar/list',
    method: 'get',
    params: query
  })
}

// 查询本地存储详细
export function getAvatar(storageId) {
  return request({
    url: '/system/avatar/' + storageId,
    method: 'get'
  })
}

// 新增本地存储
export function addAvatar(data) {
  return request({
    url: '/system/avatar',
    method: 'post',
    data: data
  })
}

// 修改本地存储
export function updateAvatar(data) {
  return request({
    url: '/system/avatar',
    method: 'put',
    data: data
  })
}

// 删除本地存储
export function delAvatar(storageId) {
  return request({
    url: '/system/avatar/' + storageId,
    method: 'delete'
  })
}

// 导出本地存储
export function exportAvatar(query) {
  return request({
    url: '/system/avatar/export',
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
// 查询参数详细
export function getConfig() {
  return request({
    url: '/system/config/appConfig',
    method: 'get'
  })
}