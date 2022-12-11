import request from '@/utils/request'

// 查询用户相册列表
export function listAlbum(query) {
  return request({
    url: '/system/album/list',
    method: 'get',
    params: query
  })
}

// 查询用户相册详细
export function getAlbum(id) {
  return request({
    url: '/system/album/' + id,
    method: 'get'
  })
}

// 新增用户相册
export function addAlbum(data) {
  return request({
    url: '/system/album',
    method: 'post',
    data: data
  })
}

// 修改用户相册
export function updateAlbum(data) {
  return request({
    url: '/system/album',
    method: 'put',
    data: data
  })
}

// 删除用户相册
export function delAlbum(id) {
  return request({
    url: '/system/album/' + id,
    method: 'delete'
  })
}

// 导出用户相册
export function exportAlbum(query) {
  return request({
    url: '/system/album/export',
    method: 'get',
    params: query
  })
}