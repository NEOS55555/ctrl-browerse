const { ipcMain } = require('electron')
const { LIFE_CIRCLE_EVT } = require('../constant')

const map = {}
map[LIFE_CIRCLE_EVT.mainHandle] = {}
exports.delPluginCircleEvt = function (type, appId) {
  map[type] = map[type] || {}
  delete map[type][appId]
}
exports.setPluginCircleEvt = function (type, appId, callback) {
  map[type] = map[type] || {}
  map[type][appId] = callback
}
exports.getPluginCircleEvt = function (type, appId) {
  return (map[type] || {})[appId]
}
// 设置主程序的handler
exports.setPluginCircleEvtMainHandler = function (appId, channel, listener) {
  map[LIFE_CIRCLE_EVT.mainHandle][appId] =
    map[LIFE_CIRCLE_EVT.mainHandle][appId] || {}
  /* if (map[LIFE_CIRCLE_EVT.mainHandle][appId][channel]) {
    console.log('该事件纯在啦', channel)
    return
  } */
  map[LIFE_CIRCLE_EVT.mainHandle][appId][channel] = listener

  const channelStr = appId + '-' + channel
  ipcMain.handle(channelStr, listener)
}
exports.clearPluginCircleEvtMainHandler = function (appId) {
  Object.keys(map[LIFE_CIRCLE_EVT.mainHandle][appId]).forEach((channel) => {
    ipcMain.removeHandler(appId + '-' + channel)
  })
}
