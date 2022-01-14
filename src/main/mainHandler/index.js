const path = require('path')
const { ipcMain } = require('electron')
const gblbalHandler = require('./gblHandler')
const gblShortcut = require('./gblShortcut')
const windowMove = require('./windowMove')
const ws = require('./ws')
const serve = require('../server')
const { INIT_WINDOW_STYLE } = require('../../com-constant')
const { winScreen, setWindowBounds } = require('../util/electronUtil')
const { isDev } = require('../../com-constant/env')
const { getData } = require('../util/store')

module.exports = function (mainWindow, appQuit) {
  windowMove(mainWindow)
  gblbalHandler(mainWindow)
  gblShortcut(mainWindow)
  ws(mainWindow)
  serve(mainWindow)

  const winChange = winScreen(mainWindow)

  ipcMain.handle('getLocalPreloadPath', (e, name) => {
    const abpath =
      'file:///' +
      path.resolve(
        __dirname,
        (isDev ? '../preload/entry/' : './preload/entry/') + name
      )
    console.log('abpath', abpath)
    return abpath
  })
  ipcMain.handle('cos', (evt, ...args) => {
    console.log('cos', ...args)
  })

  // 最大化
  ipcMain.handle('window-max', () => {
    if (mainWindow.isMaximized()) {
      // console.log('restore')
      // winChange.restore()
      setWindowBounds(mainWindow, {
        ...INIT_WINDOW_STYLE,
        x: 'center',
        y: 'center',
      })
    } else {
      winChange.setPrevdata()
      mainWindow.maximize()
    }
  })
  //接收最小化命令
  ipcMain.handle('window-min', function () {
    mainWindow.minimize()
  })

  //接收最小化命令
  ipcMain.handle('window-close', function () {
    mainWindow.hide()
    appQuit()
    // 1秒之后强行退出
    /* setTimeout(() => {
      app.exit()
    }, 1000) */
    // mainWindow.close()
  })
  ipcMain.handle('window-toTop', function () {
    mainWindow.setAlwaysOnTop(!mainWindow.isAlwaysOnTop())
  })

  // 全屏-相关的事件
  ipcMain.handle('window-isFullScreen', (event) => {
    // return mainWindow.isFullScreen()
    return winChange.isFullScreen()
  })
  ipcMain.handle('window-exitFullScreen', (event) => {
    // console.log('mainWindow.isFullScreen() 111', isFullScreen)
    winChange.exitFullScreen()
  })
  ipcMain.handle('window-toFullScreen', (event) => {
    winChange.toFullScreen()
  })
  ipcMain.handle('window-toggleFullScreen', (event) => {
    // console.log('mainWindow.isFullScreen()', isFullScreen)
    // console.log('winChange.isFullScreen()', winChange.isFullScreen())
    const isfull = winChange.isFullScreen()
    if (isfull) {
      winChange.exitFullScreen()
    } else {
      winChange.toFullScreen()
    }
    return !isfull
  })
  // registerGlobalShortcut(mainWindow, getBasicKeyMap())
  // 设置全局热键

  ipcMain.handle('getDefaultUrl',() => {
    return getData(['defaultUrl']) || ''
  })
}
