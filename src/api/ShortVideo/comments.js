import request from '@/utils/request'

// 查询动态评论列表
export function listComments(query) {
  return request({
    url: '/publish/comments/list',
    method: 'get',
    params: query
  })
}

// 查询动态评论列表
export function getCommentList(query) {
  return request({
    url: '/publish/comments/getList',
    method: 'get',
    params: query
  })
}


// 查询动态评论详细
export function getComments(id) {
  return request({
    url: '/publish/comments/' + id,
    method: 'get'
  })
}

// 新增动态评论
export function addComments(data) {
  return request({
    url: '/publish/comments',
    method: 'post',
    data: data
  })
}

// 修改动态评论
export function updateComments(data) {
  return request({
    url: '/publish/comments',
    method: 'put',
    data: data
  })
}

// 删除动态评论
export function delComments(id) {
  return request({
    url: '/publish/comments/' + id,
    method: 'delete'
  })
}

// 导出动态评论
export function exportComments(query) {
  return request({
    url: '/publish/comments/export',
    method: 'get',
    params: query
  })
}
