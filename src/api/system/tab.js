import request from '@/utils/request'

// 查询【请填写功能名称】列表
export function listTab(query) {
  return request({
    url: '/system/tab/list',
    method: 'get',
    params: query
  })
}

// 查询【请填写功能名称】详细
export function getTab(id) {
  return request({
    url: '/system/tab/' + id,
    method: 'get'
  })
}

// 新增【请填写功能名称】
export function addTab(data) {
  return request({
    url: '/system/tab',
    method: 'post',
    data: data
  })
}

// 修改【请填写功能名称】
export function updateTab(data) {
  return request({
    url: '/system/tab',
    method: 'put',
    data: data
  })
}

// 删除【请填写功能名称】
export function delTab(id) {
  return request({
    url: '/system/tab/' + id,
    method: 'delete'
  })
}

// 导出【请填写功能名称】
export function exportTab(query) {
  return request({
    url: '/system/tab/export',
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
