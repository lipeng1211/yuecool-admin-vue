import request from '@/utils/request'

// 查询列表
export function listGroup(query) {
  return request({
    url: '/article/info/list',
    method: 'get',
    params: query
  })
}

// 查询详细
export function getGroup(id) {
  return request({
    url: '/article/info/' + id,
    method: 'get'
  })
}

// 新增
export function addGroup(data) {
  return request({
    url: '/article/info',
    method: 'post',
    data: data
  })
}

// 修改
export function updateGroup(data) {
  return request({
    url: '/article/info',
    method: 'put',
    data: data
  })
}


// 新增
export function imageUnloading(data) {
  return request({
    url: '/article/info/imageUnloading',
    method: 'post',
    data: data
  })
}

// 删除
export function delGroup(ids) {
  return request({
    url: '/article/info/' + ids,
    method: 'delete'
  })
}

// 导出
export function exportGroup(query) {
  return request({
    url: '/article/info/export',
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
