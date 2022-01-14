/* const { RouteWithRoutes, routerPathTrans } = routerUtil
export { RouteWithRoutes, routerPathTrans } */

import { STATIC_PATH } from '@/constant/env'
import { specKeyMap } from '../../com-constant/keyCodeMap'
import { invoke } from './ajax'

// export const abc = '123'
function calculateTextWidth(node) {
  const value = node.value
  const style = getStyle(node)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  ctx.font = `${style.fontSize}px ${style.fontFamily}`
  return ctx.measureText(value).width
}

function getStyle(node) {
  const style = window.getComputedStyle(node, '').getPropertyValue('font-size')
  const fontFamily = window
    .getComputedStyle(node, '')
    .getPropertyValue('font-family')
  const fontSize = parseFloat(style)
  return { fontFamily: fontFamily, fontSize: fontSize }
}

export const removeClass = (node, cls) => node && node.classList.remove(cls)
export const addClass = (node, cls) => node && node.classList.add(cls)
const hasClass = (node, cls) => node && node.classList.contains(cls)
const toggleClass = (node, cls) => {
  const classList = node.classList
  const flag = hasClass(node, cls)
  flag ? classList.remove(cls) : classList.add(cls)
  return !flag
}
// ***************

export { calculateTextWidth, toggleClass, hasClass }

export function getInputKeyCodeArr(e) {
  const { keyCode } = e
  if (specKeyMap[keyCode]) {
    return
  }

  const arr = []
  if (keyCode !== 8 && keyCode !== 46) {
    //  setList(updateList(list, item, []))
    ;['altKey', 'ctrlKey', 'shiftKey', 'metaKey'].forEach((key) => {
      if (e[key]) {
        arr.push(specKeyMap[key.replace('Key', '')])
      }
    })
    arr.push(keyCode)
    e.target.blur()
  }
  return arr
}
export const getUrl = (url, mainurl) => {
  let murl = ''
  try {
    const a = new URL(url, mainurl)
    murl = a.toString()
  } catch (e) {
    console.log('err', e)
    murl = mainurl
  }
  return murl
}
export const getStaticPath = (url) => {
  const a = new URL(url, STATIC_PATH)
  return a.toString()
}

export const getM = (btyenum) => {
  const onek = 1024
  const onem = onek * onek
  if (btyenum < onek) {
    return '小于1KB'
  }
  btyenum = btyenum / onek
  if (btyenum < onem) {
    return parseInt(btyenum) + 'KB'
  }
  btyenum = btyenum / onek

  return btyenum.toFixed(2) + 'M'
}

export function isNewVersion(currentVersion, nextVersion) {
  currentVersion = currentVersion.split('.')
  nextVersion = nextVersion.split('.')
  for (var i = 0, len = currentVersion.length; i < len; i++) {
    if (parseInt(nextVersion[i]) > parseInt(currentVersion[i])) {
      return true
    } else if (parseInt(nextVersion[i]) < parseInt(currentVersion[i])) {
      return false
    }
  }
  return false
}

export function throttle(cb, time = 300, isFirst) {
  var t = null
  return function () {
    if (t) {
      return
    }

    return new Promise((resolve) => {
      if (isFirst) {
        isFirst = false
        return resolve(cb())
      }
      t = setTimeout(() => {
        isFirst = true
        t = null
        resolve(cb())
      }, time)
    })
  }
}

function fullScreenObj2() {
  // let invoker = invoke

  return {
    isFullScreen() {
      return invoke('window-isFullScreen')
    },
    toFullScreen() {
      addClass(document.body, 'full-screen')
      return invoke('window-toFullScreen')
    },
    exitFullScreen() {
      removeClass(document.body, 'full-screen')
      return invoke('window-exitFullScreen')
    },
    toggleFullScreen() {
      // console.log('没进来?????')
      return invoke('window-toggleFullScreen').then((curIsFull) => {
        if (curIsFull) {
          addClass(document.body, 'full-screen')
        } else {
          removeClass(document.body, 'full-screen')
        }
        return curIsFull
      })
    },
  }
}

export const fullScreenObj = fullScreenObj2()
