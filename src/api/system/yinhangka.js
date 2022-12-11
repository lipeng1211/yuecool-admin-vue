import request from '@/utils/request'

// 查询【请填写功能名称】列表
export function listYinhangka(query) {
  return request({
    url: '/system/yinhangka/list',
    method: 'get',
    params: query
  })
}

// 查询【请填写功能名称】详细
export function getYinhangka(id) {
  return request({
    url: '/system/yinhangka/' + id,
    method: 'get'
  })
}

// 新增【请填写功能名称】
export function addYinhangka(data) {
  return request({
    url: '/system/yinhangka',
    method: 'post',
    data: data
  })
}

// 修改【请填写功能名称】
export function updateYinhangka(data) {
  return request({
    url: '/system/yinhangka',
    method: 'put',
    data: data
  })
}

// 删除【请填写功能名称】
export function delYinhangka(id) {
  return request({
    url: '/system/yinhangka/' + id,
    method: 'delete'
  })
}

// 导出【请填写功能名称】
export function exportYinhangka(query) {
  return request({
    url: '/system/yinhangka/export',
    method: 'get',
    params: query
  })
}