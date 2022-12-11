import request from '@/utils/request'

// 查询通知列表
export function listYuecoolNotice(query) {
  return request({
    url: '/system/yuecoolNotice/list',
    method: 'get',
    params: query
  })
}

// 查询通知详细
export function getYuecoolNotice(id) {
  return request({
    url: '/system/yuecoolNotice/' + id,
    method: 'get'
  })
}

// 新增通知
export function addYuecoolNotice(data) {
  return request({
    url: '/system/yuecoolNotice',
    method: 'post',
    data: data
  })
}

// 修改通知
export function updateYuecoolNotice(data) {
  return request({
    url: '/system/yuecoolNotice',
    method: 'put',
    data: data
  })
}

// 删除通知
export function delYuecoolNotice(id) {
  return request({
    url: '/system/yuecoolNotice/' + id,
    method: 'delete'
  })
}

// 导出通知
export function exportYuecoolNotice(query) {
  return request({
    url: '/system/yuecoolNotice/export',
    method: 'get',
    params: query
  })
}

// 发送系统通知
export function sendOutSysNotice(data) {
  return request({
    url: '/system/yuecoolNotice/sendOut',
    method: 'put',
    data: data
  })
}