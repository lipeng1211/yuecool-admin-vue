import request from '@/utils/request'

// 查询群升级列表列表
export function listGroupUpgrade(query) {
  return request({
    url: '/system/groupUpgrade/list',
    method: 'get',
    params: query
  })
}

// 查询群升级列表详细
export function getGroupUpgrade(id) {
  return request({
    url: '/system/groupUpgrade/' + id,
    method: 'get'
  })
}

// 新增群升级列表
export function addGroupUpgrade(data) {
  return request({
    url: '/system/groupUpgrade',
    method: 'post',
    data: data
  })
}

// 修改群升级列表
export function updateGroupUpgrade(data) {
  return request({
    url: '/system/groupUpgrade',
    method: 'put',
    data: data
  })
}

// 删除群升级列表
export function delGroupUpgrade(id) {
  return request({
    url: '/system/groupUpgrade/' + id,
    method: 'delete'
  })
}

// 导出群升级列表
export function exportGroupUpgrade(query) {
  return request({
    url: '/system/groupUpgrade/export',
    method: 'get',
    params: query
  })
}