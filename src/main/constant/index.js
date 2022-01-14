const { version } = require('../../../package.json')

exports.SETTING = 'setting'
exports.SHORTCUTS = 'shortcuts'
exports.SOFTWARE_QUICK_START = 'softwareQuickStart'
exports.LIFE_CIRCLE_EVT = {
  onload: 'onload',
  onclose: 'onclose',
  onshow: 'onshow',
  onhide: 'onhide',
  mainHandle: 'mainHandle',
}
exports.VERSION = version
