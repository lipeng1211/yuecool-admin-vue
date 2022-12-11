import request from '@/utils/request'

// 查询课程详情列表
export function listDetails(query) {
  return request({
    url: '/system/details/list',
    method: 'get',
    params: query
  })
}

// 查询课程详情详细
export function getDetails(id) {
  return request({
    url: '/system/details/' + id,
    method: 'get'
  })
}

// 新增课程详情
export function addDetails(data) {
  return request({
    url: '/system/details',
    method: 'post',
    data: data
  })
}

// 修改课程详情
export function updateDetails(data) {
  return request({
    url: '/system/details',
    method: 'put',
    data: data
  })
}

// 删除课程详情
export function delDetails(id) {
  return request({
    url: '/system/details/' + id,
    method: 'delete'
  })
}

// 导出课程详情
export function exportDetails(query) {
  return request({
    url: '/system/details/export',
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

// 查询课程分类列表
export function listCategory(query) {
  return request({
    url: '/system/curriculumCategory/list',
    method: 'get',
    params: query
  })
}