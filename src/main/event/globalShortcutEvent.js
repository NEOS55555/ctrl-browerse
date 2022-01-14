const { globalShortcut } = require('electron')
const { initMoyuWindow, INIT_WINDOW_STYLE } = require('../../com-constant')
const { electronKeyMap, keyCodeMap } = require('../../com-constant/keyCodeMap')
const { SOFTWARE_QUICK_START } = require('../constant')
const { isShowSoftware } = require('../globalData')
const { setMoyuModeData } = require('../util/electronUtil')
// const { loadPluginShow } = require('../util/load')
const { winExecCopy$getVal } = require('../util/winc')
const { showSoftware, hideSoftware, setAutoStartup } = require('./comEvt')

// globalShortcut.isRegistered('CommandOrControl+X'))
// 注销快捷键
// globalShortcut.unregister('CommandOrControl+X')
// 清空所有快捷键
// globalShortcut.unregisterAll()
function getShortcutEventCode(key) {
  return electronKeyMap[key] || keyCodeMap[key]
}

function transKeyArr2Map(keyCodeArr) {
  if (Array.isArray(keyCodeArr)) {
    return keyCodeArr.map((k) => getShortcutEventCode(k)).join('+')
  } else if (typeof keyCodeArr === 'string') {
    return keyCodeArr
  }
}
const evtCopyWord = {}

module.exports = {
  regMap: {},
  isRegistered(keyCodeArr) {
    return globalShortcut.isRegistered(transKeyArr2Map(keyCodeArr))
  },

  register(key, keyCodeArr, cb) {
    const currentKeyStr = transKeyArr2Map(keyCodeArr)
    // 如果对于同一个按钮，注册不同的事件呢，这个判断就会有问题
    /* if (currentKeyStr === this.regMap[key]) {
      return
    } */
    this.unregister(this.regMap[key])
    // console.log(this.regMap[key])
    this.regMap[key] = currentKeyStr
    console.log('register', key, this.regMap[key])
    if (!this.regMap[key]) {
      return
    }
    globalShortcut.register(this.regMap[key], cb)
  },
  unregister(keyCodeArr) {
    const m = transKeyArr2Map(keyCodeArr)
    // console.log('unregister', m)
    if (m) {
      globalShortcut.unregister(m)
    }
  },
  unregisterAll() {
    globalShortcut.unregisterAll()
  },
  registerGlobalShortcut(mainWindow, keyCodeArrAll) {
    keyCodeArrAll.forEach((it) => {
      console.log('因该注册了吗', it.eventKey)
      if (it.isCustom) {
        if (it.eventKey) {
          this[it.eventKey](mainWindow, it)
        } else {
          this[it.key](mainWindow, it)
        }
      } else {
        this.registerComEvent(mainWindow, it)
      }
    })
  },
  // 通讯
  registerComEvent(mainWindow, { key: evt, keyCodeArr }) {
    // console.log('因该注册了吗', evt, keyCodeArr)
    this.register(evt, keyCodeArr, () => {
      // console.log('什么i情况')
      mainWindow.webContents.send('global-key-event', evt)
    })
  },
  reg(it, cb) {
    this.register(it.key, it.keyCodeArr, cb)
  },
  // 显示隐藏
  openCmtv(mainWindow, it) {
    this.reg(it, () => {
      if (isShowSoftware.get()) {
        hideSoftware(mainWindow)
      } else {
        showSoftware(mainWindow)
      }
    })
  },
  // 切换摸鱼模式
  toMoyuModeByMain(mainWindow, it) {
    this.reg(it, () => {
      for (let i in global.abtool) {
        const abt = global.abtool[i]
        if (abt && abt.moyuCb) {
          // console.log('to ,c')
          abt.isMoyuing = true
          abt.moyuData = abt.moyuCb() || initMoyuWindow
          setMoyuModeData(abt.mainwindow, abt.moyuData)
        }
      }
    })
  },
  outMoyuModeByMain(mainWindow, it) {
    this.reg(it, () => {
      for (let i in global.abtool) {
        const abt = global.abtool[i]
        clearInterval(abt.moyuTimer)
        if (abt && abt.outmoyuCb) {
          // console.log('out ,c')
          abt.isMoyuing = false
          setMoyuModeData(abt.mainwindow, abt.outmoyuCb() || INIT_WINDOW_STYLE)
        }
      }
    })
  },
  toggleShowBorderByMain(mainWindow, it) {
    this.reg(it, () => {
      for (let i in global.abtool) {
        const abt = global.abtool[i]
        if (abt && abt.mainwindow) {
          // abt.showBorderCb()
          abt.mainwindow.webContents.send('global-key-event', 'showBorder')
          abt.isShowingBorder = !abt.isShowingBorder
          if (abt.moyuData.isTransparent) {
            abt.mainwindow.setIgnoreMouseEvents(!abt.isShowingBorder)
          }
        }
      }
    })
  },
  [SOFTWARE_QUICK_START]: function (mainWindow, it) {
    // it.key

    this.reg(it, () => {
      // console.log('执行这个快捷键啦', it)
      if (isShowSoftware.get()) {
        mainWindow.webContents.send('global-info-send', {
          type: 'success',
          info: '正在启动插件，' + it.app.name + '，请稍等',
        })
      }
      winExecCopy$getVal().then((txt) => {
        let showTxt = txt.trim()
        if (evtCopyWord[it.app.appId] === showTxt) {
          // return
          showTxt = ''
        } else {
          evtCopyWord[it.app.appId] = txt
        }
        // loadPluginShow(it.app.appId, txt)

        // console.log('复制得到的', txt)
        // console.log('evtCopyWord', evtCopyWord, showTxt)
      })
    })
  },
  // 开机自启动
  autoStartup(mainWindow, val) {
    setAutoStartup(val)
  },
}
