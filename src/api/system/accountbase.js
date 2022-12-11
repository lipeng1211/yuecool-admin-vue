import request from '@/utils/request'

// 查询用户钱包列表
export function listCustAccountbaseGroup(query) {
  return request({
    url: '/system/accountbase/list',
    method: 'get',
    params: query
  })
}

// 查询用户钱包详细
export function getCustAccountbaseGroup(id) {
  return request({
    url: '/system/accountbase/' + id,
    method: 'get'
  })
}

// 新增用户钱包
export function addCustAccountbaseGroup(data) {
  return request({
    url: '/system/accountbase',
    method: 'post',
    data: data
  })
}

// 修改用户钱包
export function updateCustAccountbaseGroup(data) {
  return request({
    url: '/system/accountbase',
    method: 'put',
    data: data
  })
}

// 删除用户钱包
export function delCustAccountbaseGroup(id) {
  return request({
    url: '/system/accountbase/' + id,
    method: 'delete'
  })
}

// 导出用户钱包
export function exportCustAccountbaseGroup(query) {
  return request({
    url: '/system/accountbase/export',
    method: 'get',
    params: query
  })
}