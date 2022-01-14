const { ipcRenderer } = require('electron')

// const { renderInvoke } = require('abtool-plugin')
const { abtool } = require('../../../../package.json')
// const abtool = { appId: '123' }
const isDev = process.env.NODE_ENV === 'development'

const invoke = function (channel, ...args) {
  // TODO: 这是必须的
  return ipcRenderer.invoke(channel, ...args)
}
exports.invokerInvoke = {
  invoke,
}
// export const ipcOn = (evt, handler) => ipcRenderer.on(evt, handler)
// TODO: 这个没有，因为跟主框架没关系，只是跟当前这个窗口主程序有关
exports.ipcOn = (evt, handler) => ipcRenderer.on(evt, handler)
exports.invoke = invoke

exports.send = function (...args) {
  invoke('cos', ...args)
}
