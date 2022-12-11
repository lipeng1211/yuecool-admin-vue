import request from '@/utils/request'

// 查询讲师分类列表
export function listCategory(query) {
  return request({
    url: '/system/lecturerCategory/list',
    method: 'get',
    params: query
  })
}

// 查询讲师分类详细
export function getCategory(id) {
  return request({
    url: '/system/lecturerCategory/' + id,
    method: 'get'
  })
}

// 新增讲师分类
export function addCategory(data) {
  return request({
    url: '/system/lecturerCategory',
    method: 'post',
    data: data
  })
}

// 修改讲师分类
export function updateCategory(data) {
  return request({
    url: '/system/lecturerCategory',
    method: 'put',
    data: data
  })
}

// 删除讲师分类
export function delCategory(id) {
  return request({
    url: '/system/lecturerCategory/' + id,
    method: 'delete'
  })
}

// 导出讲师分类
export function exportCategory(query) {
  return request({
    url: '/system/lecturerCategory/export',
    method: 'get',
    params: query
  })
}