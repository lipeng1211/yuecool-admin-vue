import request from '@/utils/request'

// 查询用户信息列表
export function listAnchor(query) {
  return request({
    url: '/system/anchor/list',
    method: 'get',
    params: query
  })
}

// 查询用户信息详细
export function getAnchor(id) {
  return request({
    url: '/system/anchor/' + id,
    method: 'get'
  })
}

// 新增用户信息
export function addAnchor(data) {
  return request({
    url: '/system/anchor',
    method: 'post',
    data: data
  })
}

// 修改用户信息
export function updateAnchor(data) {
  return request({
    url: '/system/anchor',
    method: 'put',
    data: data
  })
}

// 删除用户信息
export function delAnchor(id) {
  return request({
    url: '/system/anchor/' + id,
    method: 'delete'
  })
}

// 导出用户信息
export function exportAnchor(query) {
  return request({
    url: '/system/anchor/export',
    method: 'get',
    params: query
  })
}

// 获取主播分类
export function getanchClass(query) {
  return request({
    url: '/system/anchorCategory/list',
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