import request from '@/utils/request'

// 查询行政区划列表
export function listArea(query) {
  return request({
    url: '/area/area/list',
    method: 'get',
    params: query
  })
}

// 查询行政区划详细
export function getArea(areaId) {
  return request({
    url: '/area/area/' + areaId,
    method: 'get'
  })
}

// 新增行政区划
export function addArea(data) {
  return request({
    url: '/area/area',
    method: 'post',
    data: data
  })
}

// 修改行政区划
export function updateArea(data) {
  return request({
    url: '/area/area',
    method: 'put',
    data: data
  })
}

// 删除行政区划
export function delArea(areaId) {
  return request({
    url: '/area/area/' + areaId,
    method: 'delete'
  })
}

// 导出行政区划
export function exportArea(query) {
  return request({
    url: '/area/area/export',
    method: 'get',
    params: query
  })
}

export function selectProvince() {
  return request({
    url: '/area/area/province',
    method: 'get'
  })
}

export function selectCity(parentCode) {
  return request({
    url: '/area/area/areas/' + parentCode,
    method: 'get'
  })
}
