import request from '@/utils/request'

// 查询【请填写功能名称】列表
export function listFind(query) {
  return request({
    url: '/system/find/list',
    method: 'get',
    params: query
  })
}

// 查询【请填写功能名称】详细
export function getFind(id) {
  return request({
    url: '/system/find/' + id,
    method: 'get'
  })
}

// 新增【请填写功能名称】
export function addFind(data) {
  return request({
    url: '/system/find',
    method: 'post',
    data: data
  })
}

// 修改【请填写功能名称】
export function updateFind(data) {
  return request({
    url: '/system/find',
    method: 'put',
    data: data
  })
}

// 删除【请填写功能名称】
export function delFind(id) {
  return request({
    url: '/system/find/' + id,
    method: 'delete'
  })
}

// 导出【请填写功能名称】
export function exportFind(query) {
  return request({
    url: '/system/find/export',
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
