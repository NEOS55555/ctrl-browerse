const Store = require('electron-store')
const { app } = require('electron')
const path = require('path')
const { isDev } = require('../../com-constant/env')
const userPath = app.getPath('userData')
// console.log('userPath,', userPath)
function getNewStore(apid, name) {
  const option = {
    name, //文件名称,默认 config
    // fileExtension:"json",//文件后缀,默认json
    cwd: path.resolve(userPath, (isDev ? './adata-dev/' : './adata/') + apid), //文件位置,尽量不要动
    // encryptionKey: 'aes-256-cbc', //对配置文件进行加密
    clearInvalidConfig: true, // 发生 SyntaxError  则清空配置,
  }
  if (!isDev) {
    option.encryptionKey = 'aes-256-cbc' //对配置文件进行加密
  }
  const store = new Store(option)

  // const INTERVAL_TIME = 300

  const getData = (args = []) => {
    return store.get([...args].join('.'))
  }
  const delData = (args = []) => {
    return store.delete([...args].join('.'))
  }

  const setData = (args = [], val) => {
    store.set([...args].join('.'), val)
  }
  return {
    getData,
    delData,
    setData,
  }
}
exports.pluginPath = path.resolve(userPath, './plugins')
exports.defStorePath = path.resolve(
  userPath,
  isDev ? './astore-dev/' : './astore/'
)

exports.getNewStore = getNewStore

// 默认的数据库
const { getData, setData, delData } = getNewStore('abt')

exports.getData = getData
exports.setData = setData
exports.delData = delData
