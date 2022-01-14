const { send, ipcOn, invoke } = require('../func/ajax')
const { init } = require('../func/func')
const { $ } = require('../func/jq')
/* window.document.onreadystatechange = (a, b, c) => {
  send('ab-----', a)
} */
document.addEventListener('readystatechange', function () {
  send('document ' + document.readyState)
  if (document.readyState === 'complete') {
    init()
    preload()
  }
})
window.addEventListener('load', start)

let isloaded = false
let mck = null
ipcOn('game-web-toggleMoyu', function (evt, val) {
  // send('val', val)
  if (val) {
    toMoyu()
    if (!isloaded) {
      mck = window.message('正在配置,请稍等!配置完毕将会自动关闭')
    }
  } else {
    outMoyu()
  }
})
ipcOn('game-web-playGame-keydown', function (evt, keycode) {
  var evt = document.createEvent('UIEvents')
  evt.keyCode = parseInt(keycode)
  evt.initEvent('keydown', true, true)
  // evt.initEvent('keydown', true, true)
  // 这个是小霸王里的
  document.body.dispatchEvent(evt)
  send('k', parseInt(keycode))
})

function toMoyu() {
  $('body').addClass('moyu')
  const docbody = document.body
  $('canvas').foreach((it) => {
    docbody.appendChild(it)
  })
}
function outMoyu() {
  $('body').removeClass('moyu')
}

function preloadXbw() {
  /* HTMLElement.prototype.pressKey = function (keycode) {
    var evt = document.createEvent('UIEvents')
    evt.keyCode = keycode
    evt.initEvent('keydown', true, true)
    this.dispatchEvent(evt)
  } */
}

function preload() {
  const styleTxt = `
  body.moyu {
    overflow: hidden!important;
  }
  .moyu .moyu-div-ctn {
    font-size: 0!important;
  }
  .moyu  canvas,
  .moyu .moyu-div-ctn {
    z-index: 999999;
    position: fixed!important;
    left: 0!important;
    right: 0!important;
    top: 0!important;
    bottom: 0!important;
    width: 100%!important;
    height: 100%!important;
    padding: 0!important;
    margin: 0!important;
  }
  .tenant-model-content {
    top: 127px!important;
  }
  .moyu p {
    color: red;
  }
  `
  // $('body').addClass('moyu')

  $('head').append(`<style>${styleTxt}</style>`)
}

let foucusInput = null

ipcOn('input-is-change', function (evt, val) {
  send('itc', val)
  if (foucusInput) {
    foucusInput.value = val
  }
})
/* ipcOn('input-is-entry', function (evt, val) {
  send('eeetry')
  if (!foucusInput) {
    return
  }
  var evt = foucusInput.createEvent('UIEvents')
  evt.keyCode = parseInt(13)
  evt.initEvent('keydown', true, true)
  // evt.initEvent('keydown', true, true)
  // 这个是小霸王里的
  foucusInput.dispatchEvent(evt)
}) */
function start() {
  // send('start', 'aaa')
  isloaded = true
  if (mck && typeof mck === 'function') {
    mck()
  }
  // $('a').attr('target', '_parent')

  $('input').foreach((it) => {
    it.addEventListener('focus', (e) => {
      foucusInput = e.target
      invoke('input-is-focus', e.target.value)
    })
    it.addEventListener('blur', (e) => {
      // foucusInput = e.target
      invoke('input-is-blur')
    })
  })

  // preload()
  send('preload-----abc')

  // 键盘事件
  // window.addEventListener('keydown', (event) => {})
}
