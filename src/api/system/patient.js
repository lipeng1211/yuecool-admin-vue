import request from '@/utils/request'

// 查询患者列列表
export function listPatient(query) {
  return request({
    url: '/system/patient/list',
    method: 'get',
    params: query
  })
}

// 查询患者列详细
export function getPatient(id) {
  return request({
    url: '/system/patient/' + id,
    method: 'get'
  })
}

// 新增患者列
export function addPatient(data) {
  return request({
    url: '/system/patient',
    method: 'post',
    data: data
  })
}

// 修改患者列
export function updatePatient(data) {
  return request({
    url: '/system/patient',
    method: 'put',
    data: data
  })
}

// 删除患者列
export function delPatient(id) {
  return request({
    url: '/system/patient/' + id,
    method: 'delete'
  })
}

// 导出患者列
export function exportPatient(query) {
  return request({
    url: '/system/patient/export',
    method: 'get',
    params: query
  })
}