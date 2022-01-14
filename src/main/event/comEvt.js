const { app } = require('electron')
const { isShowSoftware } = require('../globalData')
// 事件
exports.setAutoStartup = function (f) {
  // const val = app.getLoginItemSettings().openAtLogin
  // console.log('setAutoStartup', f, app.getLoginItemSettings())
  app.setLoginItemSettings({
    openAtLogin: f,
  })
}
//软件显示隐藏
exports.showSoftware = function (mainWindow) {
  mainWindow.show(true)
  /*  isShowSoftware.set(true)
  mainWindow.focus()
  mainWindow.setIgnoreMouseEvents(false)
  mainWindow.webContents.send('global-key-event', 'softwareColorful') */
}
exports.hideSoftware = function (mainWindow) {
  mainWindow.show(false)
  /* isShowSoftware.set(false)
  mainWindow.setIgnoreMouseEvents(true)
  mainWindow.webContents.send('global-key-event', 'softwareTransparent') */
}
