const { clipboard } = require('electron')
const { transKeyCodeMap, specKeyMap } = require('../../com-constant/keyCodeMap')
const { debounce } = require('../../com-util')
const { keyup, keydown } = require('../win/keybord.node')

exports.winKeyUp = function (keycode) {
  let flag = true
  try {
    keyup(keycode)
  } catch (e) {
    flag = false
    console.log('winKeyUp', e)
  }
  return flag
}
exports.winKeyDown = function (keycode) {
  let flag = true
  try {
    keydown(keycode)
  } catch (e) {
    flag = false
    console.log('winKeyDown', e)
  }
  return flag
}

exports.winPresss = (keycode) => {
  // console.log('keycode', typeof keycode, keycode)
  this.winKeyDown(keycode)
  this.winKeyUp(keycode)
}
function winExecCopy() {
  clipboard.writeText('')
  exports.winKeyDown(specKeyMap.ctrl)
  exports.winPresss(transKeyCodeMap['C'])
  exports.winKeyUp(specKeyMap.ctrl)
}
exports.winExecCopy = winExecCopy
const debounceWinExecCopy = debounce(winExecCopy, 300)
const debouncGetval = debounce(() => {
  const copyTxt = clipboard.readText()
  return copyTxt
}, 200)

exports.winExecCopy$getVal = () => {
  return new Promise((resolve) => {
    debounceWinExecCopy().finally(() => {
      debouncGetval().then((txt) => {
        clipboard.writeText('')
        resolve(txt)
      })
    })
  })
}
