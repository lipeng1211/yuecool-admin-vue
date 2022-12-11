import request from '@/utils/request'

// 查询问诊记录列表
export function listInformation(query) {
  return request({
    url: '/system/information/list',
    method: 'get',
    params: query
  })
}

// 查询问诊记录详细
export function getInformation(id) {
  return request({
    url: '/system/information/' + id,
    method: 'get'
  })
}

// 新增问诊记录
export function addInformation(data) {
  return request({
    url: '/system/information',
    method: 'post',
    data: data
  })
}

// 修改问诊记录
export function updateInformation(data) {
  return request({
    url: '/system/information',
    method: 'put',
    data: data
  })
}

// 删除问诊记录
export function delInformation(id) {
  return request({
    url: '/system/information/' + id,
    method: 'delete'
  })
}

// 导出问诊记录
export function exportInformation(query) {
  return request({
    url: '/system/information/export',
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