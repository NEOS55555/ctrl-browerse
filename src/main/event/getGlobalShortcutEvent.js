const { globalShortcut } = require('electron')
const { electronKeyMap, keyCodeMap } = require('../../com-constant/keyCodeMap')

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

module.exports = function () {
  return {
    regMap: {},
    isRegistered(keyCodeArr) {
      return globalShortcut.isRegistered(transKeyArr2Map(keyCodeArr))
    },

    register(key, keyCodeArr, cb) {
      const currentKeyStr = transKeyArr2Map(keyCodeArr)
      if (currentKeyStr === this.regMap[key]) {
        return
      }
      this.unregister(this.regMap[key])
      // console.log(this.regMap[key])
      this.regMap[key] = currentKeyStr
      // console.log('register', key, this.regMap[key])
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
      Object.keys(this.regMap).forEach((key) => {
        this.unregister(this.regMap[key])
        delete this.regMap[key]
      })
      // globalShortcut.unregisterAll()
    },
  }
}
