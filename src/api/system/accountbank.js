import request from '@/utils/request'

// 查询账户银行卡信息列表
export function listAccountbank(query) {
  return request({
    url: '/system/accountbank/list',
    method: 'get',
    params: query
  })
}

// 查询账户银行卡信息详细
export function getAccountbank(id) {
  return request({
    url: '/system/accountbank/' + id,
    method: 'get'
  })
}

// 新增账户银行卡信息
export function addAccountbank(data) {
  return request({
    url: '/system/accountbank',
    method: 'post',
    data: data
  })
}

// 修改账户银行卡信息
export function updateAccountbank(data) {
  return request({
    url: '/system/accountbank',
    method: 'put',
    data: data
  })
}

// 删除账户银行卡信息
export function delAccountbank(id) {
  return request({
    url: '/system/accountbank/' + id,
    method: 'delete'
  })
}

// 导出账户银行卡信息
export function exportAccountbank(query) {
  return request({
    url: '/system/accountbank/export',
    method: 'get',
    params: query
  })
}