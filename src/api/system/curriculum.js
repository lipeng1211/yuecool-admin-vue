import request from '@/utils/request'

// 查询课程内容列列表
export function listCurriculum(query) {
  return request({
    url: '/system/curriculum/list',
    method: 'get',
    params: query
  })
}

// 查询课程内容列详细
export function getCurriculum(id) {
  return request({
    url: '/system/curriculum/' + id,
    method: 'get'
  })
}

// 新增课程内容列
export function addCurriculum(data) {
  return request({
    url: '/system/curriculum',
    method: 'post',
    data: data
  })
}

// 修改课程内容列
export function updateCurriculum(data) {
  return request({
    url: '/system/curriculum',
    method: 'put',
    data: data
  })
}

// 删除课程内容列
export function delCurriculum(id) {
  return request({
    url: '/system/curriculum/' + id,
    method: 'delete'
  })
}

// 导出课程内容列
export function exportCurriculum(query) {
  return request({
    url: '/system/curriculum/export',
    method: 'get',
    params: query
  })
}
//上传
export function VideoUploadsByURl(form,url) {
  return request({
    url: url,
    method: 'post',
    data: form
  })
}

//上传
export function uploadUrl(form,url) {
  return request({
    url: url,
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: form
  })
}

// 新增课程批量上传视频
export function batchvideo(data) {
  return request({
    url: '/api/storage/VideoUploads',
    method: 'post',
    data: data
  })
}

// 新增课程批量上传音频
export function batchaudio(data) {
  return request({
    url: '/api/storage/audioUploads',
    method: 'post',
    data: data
  })
}
