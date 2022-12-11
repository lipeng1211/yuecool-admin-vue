import request from '@/utils/request'

// 查询课程分类列表
export function listCategory(query) {
  return request({
    url: '/system/curriculumCategory/list',
    method: 'get',
    params: query
  })
}

// 查询课程分类详细
export function getCategory(deptId) {
  return request({
    url: '/system/curriculumCategory/' + deptId,
    method: 'get'
  })
}

// 新增课程分类
export function addCategory(data) {
  return request({
    url: '/system/curriculumCategory',
    method: 'post',
    data: data
  })
}

// 修改课程分类
export function updateCategory(data) {
  return request({
    url: '/system/curriculumCategory',
    method: 'put',
    data: data
  })
}

// 删除课程分类
export function delCategory(deptId) {
  return request({
    url: '/system/curriculumCategory/' + deptId,
    method: 'delete'
  })
}

// 导出课程分类
export function exportCategory(query) {
  return request({
    url: '/system/curriculumCategory/export',
    method: 'get',
    params: query
  })
}
