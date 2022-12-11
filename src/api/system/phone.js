import request from '@/utils/request'

// 查询【请填写功能名称】列表
export function listPhone(query) {
  return request({
    url: '/system/phone/list',
    method: 'get',
    params: query
  })
}

// 查询【请填写功能名称】详细
export function getPhone(userUid) {
  return request({
    url: '/system/phone/' + userUid,
    method: 'get'
  })
}

// 新增【请填写功能名称】
export function addPhone(data) {
  return request({
    url: '/system/phone',
    method: 'post',
    data: data
  })
}

// 修改【请填写功能名称】
export function updatePhone(data) {
  return request({
    url: '/system/phone',
    method: 'put',
    data: data
  })
}

// 删除【请填写功能名称】
export function delPhone(userUid) {
  return request({
    url: '/system/phone/' + userUid,
    method: 'delete'
  })
}

// 导出【请填写功能名称】
export function exportPhone(query) {
  return request({
    url: '/system/phone/export',
    method: 'get',
    params: query
  })
}