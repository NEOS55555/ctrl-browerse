const path = require('path')
// const fs = require('fs')

const {
  app,
  BrowserWindow,
  protocol,
  Menu,
  globalShortcut,
  Tray,
  ipcMain,
} = require('electron')
const {
  NAV_HEIGHT,
  WINDOW_WIDTH,
  WINDOW_HEIGHT,
  INIT_WINDOW_STYLE,
} = require('../com-constant')
const { isDev } = require('../com-constant/env')
const mainHandler = require('./mainHandler')
const { showSoftware, hideSoftware } = require('./event/comEvt')
const { getRand } = require('../com-util')
const { getData, setData } = require('./util/store')
const { VERSION } = require('./constant')
// const updateHandle = require('./util/updateHandle')
function appQuit() {
  try {
    tray = null
    globalShortcut.unregisterAll()
  } catch (e) {}
  app.quit()
  app.exit()
}
console.log('isDev', isDev)
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  appQuit()
}
// node 请求，回避非授信证书的问题,允许连接到没有证书的SSL站点。
// 只要调用了没有受信的https就会报错：CERT_UNTRUSTED
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
let count = 5100
global.abtool = {}
global.gbltool = {
  getExpress() {
    return require('express')
  },
  getSuperagent(isCharset) {
    const superagent = require('superagent')
    if (isCharset) {
      var charset = require('superagent-charset')
      charset(superagent)
    }
    return superagent
  },
  getPort() {
    // return getRand(3000, 63000)
    return count++
  },
}

let mainWindow = null
let tray = null
const createWindow = () => {
  mainWindow = new BrowserWindow({
    ...INIT_WINDOW_STYLE,
    // show: false, // 這個如果去掉注釋，會展示不了的
    title: 'abtool',
    frame: false,
    // 透明话之后，全屏切换将会失效
    transparent: true,
    // alwaysOnTop: true,
    // setAlwaysOnTop
    // fullscreen: true,
    // resizable: false,
    // minHeight: NAV_HEIGHT,
    // maxHeight: WINDOW_HEIGHT,
    webPreferences: {
      webviewTag: true,
      webSecurity: false,
      // allowRunningInsecureContent: true,
      nodeIntegration: true,
      contextIsolation: false, // 可以在渲染程序中使用node
      // preload: path.resolve(path.join(__dirname, './preload/index.js')),
    },
  })
  // mainWindow.setSize(WINDOW_WIDTH, WINDOW_HEIGHT)
  // mainWindow.setSize(WINDOW_WIDTH, NAV_HEIGHT)
  // mainWindow.setMaximizable(false)
  // mainWindow.setSkipTaskbar(true)
  if (isDev) {
    mainWindow.loadURL(`http://localhost:30004/`)
    /* mainWindow.loadFile(
      path.resolve(__dirname, '../../app/dist/render/index.html')
    ) */
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.resolve(__dirname, '../render/index.html'))
    // mainWindow.webContents.openDevTools()
  }
  // 这个是测试插件加载的
  /* require('D:/test/1/main.js')({
    db: require('electron-store'),
  }) */
  mainHandler(mainWindow, appQuit)
  /*  globalShortcut.register('a', function () {
    mainWindow.setSize(1000, 1000)
  }) */
  /* const { loadCurrentPlugin } = loadPlugin('123')
  loadCurrentPlugin() */

  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (input.key === 'F4' && input.alt) {
      event.preventDefault()
    }
    mainWindow.webContents.setIgnoreMenuShortcuts(
      input.key === 'F4' && input.alt
    )
  })
  createTray()
  // test

  // ******************************
}
// 創建系統托盤
function createTray() {
  tray = new Tray(
    path.resolve(__dirname, (isDev ? '../../app/' : '../../') + 'icon/ico.png')
  )
  const contextMenu = Menu.buildFromTemplate([
    /* {
      label: '官网',
      click() {
        // console.log('wonima')
      },
    }, */
    {
      label: '版本v' + VERSION,
      click() {
        // console.log('wonima')
      },
    },
    /* {
      label: '检测更新',
      click() {
        updateHandle(mainWindow)
        // console.log('wonima')
      },
    }, */
    /* {
      label: '设置',
      click() {
        // console.log('wonima')
      },
    }, */
    {
      label: '退出',
      click() {
        // console.log('wonima')
        appQuit()
      },
    },
  ])
  tray.setToolTip('(#`O′)开心每一天')
  tray.setContextMenu(contextMenu)
  tray.on('click', function () {
    // console.log('???没来偶尔')
    showSoftware(mainWindow)
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  // if (process.env.NODE_ENV === 'production') {
  // }
  createWindow()
  // updateHandle(mainWindow)
})

// 使用本地图片
app.whenReady().then(() => {
  //注册FileProtocol
  protocol.registerFileProtocol(
    'file',
    (request, callback) => {
      //截取file:///之后的内容，也就是我们需要的
      const url = request.url.substr(8)
      // console.log((decodeURI(url)))
      callback(decodeURI(url))
      //使用callback获取真正指向内容
      // callback({ path: path.normalize(`${__dirname}/${url}`) })
    },
    (error) => {
      if (error) console.error('Failed to register protocol')
    }
  )
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    appQuit()
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
// 限制只开一个
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  appQuit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // 当运行第二个实例时,将会聚焦到mainWindow这个窗口
    if (mainWindow) {
      // if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
      mainWindow.show()
    }
  })
}
