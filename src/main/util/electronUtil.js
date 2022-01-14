const { INIT_WINDOW_STYLE } = require('../../com-constant')

// const { doubced } = require('../../com-function')
function setWindowBounds(mainWindow, data) {
  mainWindow.setSize(data.width, data.height)

  if (data.x === data.y && data.x === 'center') {
    mainWindow.center()
  } else if (data.x != null && data.y != null) {
    mainWindow.setPosition(data.x, data.y)
  }
}

exports.setWindowBounds = setWindowBounds

exports.setMoyuModeData = function (mainWin, data = {}) {
  setWindowBounds(mainWin, data)
  mainWin.setAlwaysOnTop(data.isTop, 'screen-saver')
  mainWin.setIgnoreMouseEvents(data.isTransparent)
}

function winScreen(win) {
  let isFullScreen = false
  let prevxy = {
    // width:
    ...INIT_WINDOW_STYLE,
    x: 'center',
    y: 'center',
  }
  win.on('enter-full-screen', () => {
    // isFullScreen = true
    setPrevdata()
  })
  /* const doubcedMoved = doubced(setPrevxy, 500)
  win.on('move', () => {
    // isFullScreen = true
    doubcedMoved()
  }) */
  function setPrevxy() {
    const [x, y] = win.getPosition()
    prevxy.x = x
    prevxy.y = y
    console.log('setPrevxy', prevxy)
  }
  function getPosi() {
    var data = win.getBounds()
    const [x, y] = win.getPosition()
    data.x = x
    data.y = y
    return data
  }
  function setPrevdata() {
    prevxy = getPosi()
    console.log('setPrevdata', prevxy)
    return prevxy
  }
  /* win.on('blur', (a, b) => {
    console.log('blur', win.getBounds())
  }) */
  function toggleAddSize(data) {
    let isAdd = false

    return {
      isAdded() {
        return isAdd
      },
      hide() {
        if (!isAdd) {
          return
        }
        isAdd = false
        const dat = getPosi()
        // restore()
        setWindowBounds(win, {
          width: dat.width - (data.width || 0),
          height: dat.height - (data.height || 0),
        })
      },
      show(letd) {
        if (isAdd) {
          return
        }
        isAdd = true
        data = letd || data
        const { width, height } = setPrevdata()
        setWindowBounds(win, {
          width: width + (data.width || 0),
          height: height + (data.height || 0),
        })
      },
      toggle(data) {
        if (isAdd) {
          this.hide()
        } else {
          this.show(data)
        }
        return isAdd
      },
    }
  }
  function toFullScreen() {
    // 透明化后，这里获取的是全屏的信息
    // console.log(win.getBounds())
    /* prevxy = win.getBounds()
    const [x, y] = win.getPosition()
    prevxy.x = x
    prevxy.y = y */
    win.setFullScreen(true)
    isFullScreen = true
    // console.log('prevxy', prevxy)
  }
  function exitFullScreen() {
    // console.log('退出全屏', isFullScreen)
    if (isFullScreen) {
      isFullScreen = false
      restore()
    }
  }

  function restore() {
    setWindowBounds(win, prevxy)
  }
  return {
    setPrevdata,
    toggleAddSize,
    setfs(f) {
      isFullScreen = f
    },
    isFullScreen() {
      return isFullScreen
    },
    toFullScreen,
    exitFullScreen,
    restore,
  }
}

exports.winScreen = winScreen
