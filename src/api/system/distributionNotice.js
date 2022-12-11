import axios from 'axios'
import request from '@/utils/request'

//提交信息
export function submitMsg(data) {
  return request({
    url: '/system/missuUsers/noticeMessage',
    method: 'post',
    data: data
  })
}

//上传
export function uploadUrl(form,url) {
  return axios({
    url: url,
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: form
  })
}