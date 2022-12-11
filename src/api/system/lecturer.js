import request from '@/utils/request'

// 查询讲师列表
export function listLecturer(query) {
  return request({
    url: '/system/lecturer/list',
    method: 'get',
    params: query
  })
}

// 查询讲师详细
export function getLecturer(id) {
  return request({
    url: '/system/lecturer/' + id,
    method: 'get'
  })
}

// 新增讲师
export function addLecturer(data) {
  return request({
    url: '/system/lecturer',
    method: 'post',
    data: data
  })
}

// 修改讲师
export function updateLecturer(data) {
  return request({
    url: '/system/lecturer',
    method: 'put',
    data: data
  })
}

// 删除讲师
export function delLecturer(id) {
  return request({
    url: '/system/lecturer/' + id,
    method: 'delete'
  })
}

// 导出讲师
export function exportLecturer(query) {
  return request({
    url: '/system/lecturer/export',
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

// 查询讲师分类列表
export function listCategory(query) {
  return request({
    url: '/system/lecturerCategory/list',
    method: 'get',
    params: query
  })
}