import request from '@/utils/request'

// 查询按药开方列表
export function listPrescription(query) {
  return request({
    url: '/system/prescription/list',
    method: 'get',
    params: query
  })
}

// 查询按药开方详细
export function getPrescription(id) {
  return request({
    url: '/system/prescription/' + id,
    method: 'get'
  })
}

// 新增按药开方
export function addPrescription(data) {
  return request({
    url: '/system/prescription',
    method: 'post',
    data: data
  })
}

// 修改按药开方
export function updatePrescription(data) {
  return request({
    url: '/system/prescription',
    method: 'put',
    data: data
  })
}

// 删除按药开方
export function delPrescription(id) {
  return request({
    url: '/system/prescription/' + id,
    method: 'delete'
  })
}

// 导出按药开方
export function exportPrescription(query) {
  return request({
    url: '/system/prescription/export',
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