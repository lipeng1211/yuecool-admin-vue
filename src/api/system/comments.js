import request from '@/utils/request'

// 查询动态评论列表
export function listComments(query) {
  return request({
    url: '/system/comments1/list',
    method: 'get',
    params: query
  })
}

// 查询动态评论详细
export function getComments(id) {
  return request({
    url: '/system/comments1/' + id,
    method: 'get'
  })
}

// 新增动态评论
export function addComments(data) {
  return request({
    url: '/system/comments1',
    method: 'post',
    data: data
  })
}

// 修改动态评论
export function updateComments(data) {
  return request({
    url: '/system/comments1',
    method: 'put',
    data: data
  })
}

// 删除动态评论
export function delComments(id) {
  return request({
    url: '/system/comments1/' + id,
    method: 'delete'
  })
}

// 导出动态评论
export function exportComments(query) {
  return request({
    url: '/system/comments1/export',
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