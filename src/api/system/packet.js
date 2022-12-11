import request from '@/utils/request'

// 查询红包列表
export function listPacket(query) {
  return request({
    url: '/system/packet/list',
    method: 'get',
    params: query
  })
}

// 查询红包详细
export function getPacket(id) {
  return request({
    url: '/system/packet/' + id,
    method: 'get'
  })
}

// 新增红包
export function addPacket(data) {
  return request({
    url: '/system/packet',
    method: 'post',
    data: data
  })
}

// 修改红包
export function updatePacket(data) {
  return request({
    url: '/system/packet',
    method: 'put',
    data: data
  })
}

// 删除红包
export function delPacket(id) {
  return request({
    url: '/system/packet/' + id,
    method: 'delete'
  })
}

// 导出红包
export function exportPacket(query) {
  return request({
    url: '/system/packet/export',
    method: 'get',
    params: query
  })
}