import request from '@/utils/request'

// 查询会员分类列表
export function listVipList(query) {
  return request({
    url: '/system/vipList/list',
    method: 'get',
    params: query
  })
}

// 查询会员分类详细
export function getVipList(id) {
  return request({
    url: '/system/vipList/' + id,
    method: 'get'
  })
}

// 新增会员分类
export function addVipList(data) {
  return request({
    url: '/system/vipList',
    method: 'post',
    data: data
  })
}

// 修改会员分类
export function updateVipList(data) {
  return request({
    url: '/system/vipList',
    method: 'put',
    data: data
  })
}

// 删除会员分类
export function delVipList(id) {
  return request({
    url: '/system/vipList/' + id,
    method: 'delete'
  })
}

// 导出会员分类
export function exportVipList(query) {
  return request({
    url: '/system/vipList/export',
    method: 'get',
    params: query
  })
}