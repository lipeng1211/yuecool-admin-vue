import request from '@/utils/request'

// 查询本地存储列表
export function listStorage(query) {
  return request({
    url: '/system/storage/list',
    method: 'get',
    params: query
  })
}

// 查询本地存储详细
export function getStorage(storageId) {
  return request({
    url: '/system/storage/' + storageId,
    method: 'get'
  })
}

// 新增本地存储
export function addStorage(data) {
  return request({
    url: '/system/storage',
    method: 'post',
    data: data
  })
}

// 修改本地存储
export function updateStorage(data) {
  return request({
    url: '/system/storage',
    method: 'put',
    data: data
  })
}

// 删除本地存储
export function delStorage(storageId) {
  return request({
    url: '/system/storage/' + storageId,
    method: 'delete'
  })
}

// 导出本地存储
export function exportStorage(query) {
  return request({
    url: '/system/storage/export',
    method: 'get',
    params: query
  })
}