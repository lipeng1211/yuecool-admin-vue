import request from '@/utils/request'

// 查询公告列表
export function listSysNotice(query) {
  return request({
    url: '/system/SysNotice/list',
    method: 'get',
    params: query
  })
}

// 查询公告详细
export function getSysNotice(id) {
  return request({
    url: '/system/SysNotice/' + id,
    method: 'get'
  })
}

// 新增公告
export function addSysNotice(data) {
  return request({
    url: '/system/SysNotice',
    method: 'post',
    data: data
  })
}

// 修改公告
export function updateSysNotice(data) {
  return request({
    url: '/system/SysNotice',
    method: 'put',
    data: data
  })
}

// 修改公告
export function sendOutSysNotice(data) {
  return request({
    url: '/system/SysNotice/sendOut',
    method: 'put',
    data: data
  })
}

// 删除公告
export function delSysNotice(id) {
  return request({
    url: '/system/SysNotice/' + id,
    method: 'delete'
  })
}

// 导出公告
export function exportSysNotice(query) {
  return request({
    url: '/system/SysNotice/export',
    method: 'get',
    params: query
  })
}
