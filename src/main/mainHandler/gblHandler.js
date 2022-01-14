const { ipcMain } = require('electron')

const {
  WINDOW_HEIGHT,
  WINDOW_WIDTH,
  NAV_HEIGHT,
  // SOFTWARE_DISAPERA_TIME,
} = require('../../com-constant')
const { isDev } = require('../../com-constant/env')
const { hideSoftware } = require('../event/comEvt')
const { isShowListGsAb } = require('../globalData')

let hideTimmer = null
module.exports = function (mainWindow) {
  mainWindow.on('focus', () => {
    clearTimeout(hideTimmer)
    // console.log('???focus', isShowListGsAb.get())
    if (isShowListGsAb.get()) {
      return
    }
    // mainWindow.webContents.send('window-focus')
  })
  mainWindow.on('blur', () => {
    // mainWindow.webContents.send('window-blur')
    if (isDev) {
      return
    }
    // hideTimmer = setTimeout(() => {
    // hideSoftware(mainWindow)
    // }, SOFTWARE_DISAPERA_TIME)
  })
  // 设置位置
  ipcMain.handle('global-showList', (evt, isShowList) => {
    isShowListGsAb.set(isShowList)
    console.log('isShowList', isShowList)
    // 当关闭的时候也要聚集
    if (!isShowList) {
      // mainWindow.webContents.send('window-focus')
    }
    mainWindow.setSize(WINDOW_WIDTH, isShowList ? WINDOW_HEIGHT : NAV_HEIGHT)
  })
}
