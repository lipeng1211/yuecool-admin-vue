import request from '@/utils/request'

// 查询伊语钻石列列表
export function listList(query) {
  return request({
    url: '/system/DiamondList/list',
    method: 'get',
    params: query
  })
}

// 查询伊语钻石列详细
export function getList(id) {
  return request({
    url: '/system/DiamondList/' + id,
    method: 'get'
  })
}

// 新增伊语钻石列
export function addList(data) {
  return request({
    url: '/system/DiamondList',
    method: 'post',
    data: data
  })
}

// 修改伊语钻石列
export function updateList(data) {
  return request({
    url: '/system/DiamondList',
    method: 'put',
    data: data
  })
}

// 删除伊语钻石列
export function delList(id) {
  return request({
    url: '/system/DiamondList/' + id,
    method: 'delete'
  })
}

// 导出伊语钻石列
export function exportList(query) {
  return request({
    url: '/system/DiamondList/export',
    method: 'get',
    params: query
  })
}