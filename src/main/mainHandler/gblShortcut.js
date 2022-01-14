const { ipcMain } = require('electron')
const { BASIC } = require('../../com-constant')
const { getRandId } = require('../../com-util')
const { SOFTWARE_QUICK_START } = require('../constant')

const globalShortcutEvent = require('../event/globalShortcutEvent')
const {
  setShortcuts,
  getShortcuts,
  getQuickStarShortcuts,
  setQuickStarShortcuts,
  delQuickStarShortcuts,
} = require('../db/settingdb')
const {
  getDefaultKeyArrByType,
  getDefTransCode,
  object2Array,
} = require('../util')
// const { loadPluginShow } = require('../util/load')

module.exports = function (mainWindow) {
  // 注册-基础的按钮事件
  globalShortcutEvent.registerGlobalShortcut(
    mainWindow,
    getDefTransCode(
      getShortcuts(BASIC),
      getDefaultKeyArrByType(BASIC).filter((it) => !it.notButton)
    )
  )
  // console.log('getQuickStarShortcuts()', getQuickStarShortcuts())
  // 注册-快速软件启动的按钮事件
  globalShortcutEvent.registerGlobalShortcut(
    mainWindow,
    object2Array(getQuickStarShortcuts()).filter(
      (it) => it.keyCodeArr && it.keyCodeArr.length > 0
    )
  )

  // getQuickStarShortcuts([id]) || {}

  // 快捷键
  ipcMain.handle('global-get-setting-shortcuts', (event, bigType) => {
    // 设置快捷键
    const settingArr = getShortcuts([bigType])
    const defaultArr = getDefaultKeyArrByType(bigType)
    return getDefTransCode(settingArr, defaultArr)
  })
  ipcMain.handle('global-shortcuts-isRegistered', (event, keyCodeArr) => {
    return globalShortcutEvent.isRegistered(keyCodeArr)
  })
  ipcMain.handle('global-shortcuts-set', (event, bigType, data) => {
    // 设置快捷键
    delete data.name
    // delete data.type
    setShortcuts([bigType, data.key], data)
    globalShortcutEvent.registerGlobalShortcut(mainWindow, [data])
  })
  // 设置全局热键
  //
  ipcMain.handle('global-software-quickstartup-getList', () => {
    return object2Array(getQuickStarShortcuts())
  })
  ipcMain.handle('global-software-quickstartup-newItem', (evt) => {
    const item = {
      id: getRandId(),
      key: getRandId(),
      eventKey: SOFTWARE_QUICK_START,
      isCustom: true,
    }
    setQuickStarShortcuts([item.id], item)
    return item
  })
  ipcMain.handle('global-software-quickstartup-set', (evt, id, data) => {
    let item = getQuickStarShortcuts([id]) || {}
    item = {
      ...item,
      ...data,
    }
    setQuickStarShortcuts([id], item)
    /* if (item.keyCodeArr) {
      globalShortcutEvent.unregister(item.keyCodeArr)
    } */
    if (item.app && item.keyCodeArr) {
      globalShortcutEvent.registerGlobalShortcut(mainWindow, [item])
    }
  })
  ipcMain.handle('global-software-quickstartup-del', (evt, item) => {
    delQuickStarShortcuts([item.id])
    globalShortcutEvent.unregister(item.keyCodeArr)
  })
  ipcMain.handle('plugin-startup', (evt, appId) => {
    // loadPluginShow(appId)
  })
}
