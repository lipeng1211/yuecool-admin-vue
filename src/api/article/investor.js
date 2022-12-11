import request from '@/utils/request'

// 查询列表
export function listGroup(query) {
  return request({
    url: '/article/investor/list',
    method: 'get',
    params: query
  })
}

// 查询详细
export function getGroup(id) {
  return request({
    url: '/article/investor/' + id,
    method: 'get'
  })
}

// 新增
export function addGroup(data) {
  return request({
    url: '/article/investor',
    method: 'post',
    data: data
  })
}

// 修改
export function updateGroup(data) {
  return request({
    url: '/article/investor',
    method: 'put',
    data: data
  })
}

// 删除
export function delGroup(ids) {
  return request({
    url: '/article/investor/' + ids,
    method: 'delete'
  })
}

// 导出
export function exportGroup(query) {
  return request({
    url: '/article/investor/export',
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
