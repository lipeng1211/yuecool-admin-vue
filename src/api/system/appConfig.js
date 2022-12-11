import request from '@/utils/request'


// 查询参数详细
export function getConfig() {
  return request({
    url: '/system/config/appConfig',
    method: 'get'
  })
}

// 修改参数配置
export function updateConfig(data) {
  return request({
    url: '/system/config/updateAppConfig',
    method: 'post',
    data: data
  })
}
