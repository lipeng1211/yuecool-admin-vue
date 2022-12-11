import request from '@/utils/request'

// 查询群组列表
export function listGroup(query) {
  return request({
    url: '/group/group/list',
    method: 'get',
    params: query
  })
}

// 查询群组详细
export function getGroup(gId) {
  return request({
    url: '/group/group/' + gId,
    method: 'get'
  })
}

// 新增群组
export function addGroup(data) {
  return request({
    url: '/group/group',
    method: 'post',
    data: data
  })
}

// 修改群组
export function updateGroup(data) {
  return request({
    url: '/group/group',
    method: 'put',
    data: data
  })
}

// 删除群组
export function delGroup(gId) {
  return request({
    url: '/system/record/' + gId,
    method: 'delete'
  })
}

// 删除 销毁 
export function removeGroup(gId) {
  return request({
    url: '/group/group/del/' + gId,
    method: 'delete'
  })
}


// 导出群组
export function exportGroup(query) {
  return request({
    url: '/group/group/export',
    method: 'get',
    params: query
  })
}