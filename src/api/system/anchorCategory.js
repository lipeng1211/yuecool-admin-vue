import request from '@/utils/request'

// 查询主播分类列表
export function listAnchorCategory(query) {
  return request({
    url: '/system/anchorCategory/list',
    method: 'get',
    params: query
  })
}

// 查询主播分类详细
export function getAnchorCategory(id) {
  return request({
    url: '/system/anchorCategory/' + id,
    method: 'get'
  })
}

// 新增主播分类
export function addAnchorCategory(data) {
  return request({
    url: '/system/anchorCategory',
    method: 'post',
    data: data
  })
}

// 修改主播分类
export function updateAnchorCategory(data) {
  return request({
    url: '/system/anchorCategory',
    method: 'put',
    data: data
  })
}

// 删除主播分类
export function delAnchorCategory(id) {
  return request({
    url: '/system/anchorCategory/' + id,
    method: 'delete'
  })
}

// 导出主播分类
export function exportAnchorCategory(query) {
  return request({
    url: '/system/anchorCategory/export',
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