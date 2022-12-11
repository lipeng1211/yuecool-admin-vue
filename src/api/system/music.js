import request from '@/utils/request'

// 查询本地存储列表
export function listMusic(query) {
  return request({
    url: '/system/music/list',
    method: 'get',
    params: query
  })
}

// 查询本地存储详细
export function getMusic(storageId) {
  return request({
    url: '/system/music/' + storageId,
    method: 'get'
  })
}

// 新增本地存储
export function addMusic(data) {
  return request({
    url: '/system/music',
    method: 'post',
    data: data
  })
}

// 修改本地存储
export function updateMusic(data) {
  return request({
    url: '/system/music',
    method: 'put',
    data: data
  })
}

// 删除本地存储
export function delMusic(storageId) {
  return request({
    url: '/system/music/' + storageId,
    method: 'delete'
  })
}

// 导出本地存储
export function exportMusic(query) {
  return request({
    url: '/system/music/export',
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