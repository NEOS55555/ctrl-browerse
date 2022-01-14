const { SHORTCUTS, SETTING, SOFTWARE_QUICK_START } = require('../constant')
const { getData, setData, delData } = require('../util/store')

exports.getShortcuts = (arr) => {
  arr = Array.isArray(arr) ? arr : [arr]
  return getData([SETTING, SHORTCUTS, ...arr])
}
exports.setShortcuts = (arr, data) => {
  arr = Array.isArray(arr) ? arr : [arr]
  setData([SETTING, SHORTCUTS, ...arr], data)
}

exports.getQuickStarShortcuts = (arr = []) => {
  return this.getShortcuts([SOFTWARE_QUICK_START, ...arr])
}
exports.setQuickStarShortcuts = (arr = [], data) => {
  return this.setShortcuts([SOFTWARE_QUICK_START, ...arr], data)
}
exports.delQuickStarShortcuts = (arr = []) => {
  return delData([SETTING, SHORTCUTS, SOFTWARE_QUICK_START, ...arr])
}
