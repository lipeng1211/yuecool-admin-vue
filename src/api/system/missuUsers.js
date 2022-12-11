import request from '@/utils/request'

// 查询用户管理列表
export function listMissuUsers(query) {
  return request({
    url: '/system/missuUsers/list',
    method: 'get',
    params: query
  })
}

// 查询用户管理详细
export function getMissuUsers(userUid) {
  return request({
    url: '/system/missuUsers/' + userUid,
    method: 'get'
  })
}

// 新增用户管理
export function addMissuUsers(data) {
  return request({
    url: '/system/missuUsers',
    method: 'post',
    data: data
  })
}

// 修改用户管理
export function updateMissuUsers(data) {
  return request({
    url: '/system/missuUsers',
    method: 'put',
    data: data
  })
}

// 删除用户管理
export function delMissuUsers(userUid) {
  return request({
    url: '/system/missuUsers/' + userUid,
    method: 'delete'
  })
}

// 删除用户管理
export function delChatRC(userUid) {
  return request({
    url: '/system/missuUsers/delMsg/' + userUid,
    method: 'delete'
  })
}

// 导出用户管理
export function exportMissuUsers(query) {
  return request({
    url: '/system/missuUsers/export',
    method: 'get',
    params: query
  })
}

// 新增封禁ip
export function addIp(data) {
  return request({
    url: '/system/ip',
    method: 'post',
    data: data
  })
}

// 修改封禁ip
export function updateIp(data) {
  return request({
    url: '/system/ip',
    method: 'put',
    data: data
  })
}

// 删除封禁ip
export function delIp(id) {
  return request({
    url: '/system/ip/' + id,
    method: 'delete'
  })
}

// 查询用户钱包列表
export function listCustAccountbaseGroup(query) {
  return request({
    url: '/system/CustAccountbaseGroup/list',
    method: 'get',
    params: query
  })
}

// 修改用户钱包
export function updateGroup(data) {
  return request({
    url: '/system/CustAccountbaseGroup',
    method: 'put',
    data: data
  })
}



// 生成群成员
export function generateUserV2(query) {
  return request({
    url: '/system/missuUsers/generateUser',
    method: 'get',
    params: query
  })
}
