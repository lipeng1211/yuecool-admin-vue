import request from '@/utils/request'

// 查询动态列表
export function listPublishs(query) {
  return request({
    url: '/publishs/publishs/list',
    method: 'get',
    params: query
  })
}

// 查询动态详细
export function getPublishs(id) {
  return request({
    url: '/publishs/publishs/' + id,
    method: 'get'
  })
}

// 新增动态
export function addPublishs(data) {
  return request({
    url: '/publishs/publishs',
    method: 'post',
    data: data
  })
}

// 修改动态
export function updatePublishs(data) {
  return request({
    url: '/publishs/publishs',
    method: 'put',
    data: data
  })
}

// 删除动态
export function delPublishs(id) {
  return request({
    url: '/publishs/publishs/' + id,
    method: 'delete'
  })
}

// 导出动态
export function exportPublishs(query) {
  return request({
    url: '/publishs/publishs/export',
    method: 'get',
    params: query
  })

}

// 封禁用户
export function banUser(data) {
  return request({
    url: '/publishs/publishs/banUser',
    method: 'post',
    data: data
  })
}

// 解封用户
export function unBanUser(data) {
  return request({
    url: '/publishs/publishs/unBanUser',
    method: 'post',
    data: data
  })
}
