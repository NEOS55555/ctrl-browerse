import { isDev } from '@/constant/env'
import { getUrl } from '@/util'
import apiMap from './apiMap'
import axiosCb from './axiosCb'

// 检测一遍
if (isDev) {
  const item = Object.keys(apiMap).find(
    (it) => Object.keys(axiosCb).indexOf(it) !== -1
  )
  if (item) {
    throw Error(`apiMap不可重复添加名称为${item}的接口`)
  }
}
function send(url, config = {}) {
  let path = url.path
  /* if (isDev) {
    path = (url.proxy || process.env.REACT_APP_PROXY_API || '') + path
  } */
  path = (url.proxy || process.env.REACT_APP_PROXY_API || '') + path
  return axiosCb.send({ ...url, path }, config)
}
const apiAxiosSend = {}
for (let key in apiMap) {
  const apiItem = apiMap[key]
  apiAxiosSend[key] = function (config) {
    return send(apiItem, config)
  }
}
const apiAxios = {
  send,
  ...apiAxiosSend,
}

export default apiAxios
