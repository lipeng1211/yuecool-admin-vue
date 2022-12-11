import request from '@/utils/request'

// 查询课程评论列表
export function listComments(query) {
  return request({
    url: '/system/comments2/list',
    method: 'get',
    params: query
  })
}

// 查询课程评论详细
export function getComments(id) {
  return request({
    url: '//system/comments2/' + id,
    method: 'get'
  })
}

// 新增课程评论
export function addComments(data) {
  return request({
    url: '//system/comments2',
    method: 'post',
    data: data
  })
}

// 修改课程评论课程评论
export function updateComments(data) {
  return request({
    url: '//system/comments2',
    method: 'put',
    data: data
  })
}

// 删除课程评论
export function delComments(id) {
  return request({
    url: '//system/comments2/' + id,
    method: 'delete'
  })
}

// 导出课程评论
export function exportComments(query) {
  return request({
    url: '//system/comments2/export',
    method: 'get',
    params: query
  })
}

//上传
export function uploadUrl(form, url) {
  return request({
    url: url,
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: form
  })
}
