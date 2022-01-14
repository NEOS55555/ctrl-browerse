const { BASIC } = require('../../com-constant')
const { specKeyMap, transKeyCodeMap } = require('../../com-constant/keyCodeMap')
const getBasicDefaultKeyArr = function () {
  return [
    { key: 'common-show', name: '快捷键', notButton: true },
    {
      key: 'openCmtv',
      name: '显示/隐藏软件',
      keyCodeArr: [specKeyMap.ctrl, transKeyCodeMap.Space],
      isCombination: true,
      isCustom: true,
    },
    { key: 'common-show1', name: '常规', notButton: true },
    {
      key: 'toMoyuModeByMain',
      name: '所有插件开启摸鱼模式',
      keyCodeArr: [specKeyMap.alt, transKeyCodeMap['1']],
      isCombination: true,
      isCustom: true,
    },
    {
      key: 'outMoyuModeByMain',
      name: '所有插件关闭摸鱼模式',
      keyCodeArr: [specKeyMap.alt, transKeyCodeMap['2']],
      isCombination: true,
      isCustom: true,
    },
    {
      key: 'toggleShowBorderByMain',
      name: '所有插件显示/隐藏边框',
      keyCodeArr: [specKeyMap.alt, transKeyCodeMap['3']],
      isCombination: true,
      isCustom: true,
    },
    {
      key: 'autoStartup',
      name: '开机启动(推荐开启)',
      type: 'switch',
      keyCodeArr: true,
      isCustom: true,
    },
  ]
}
const map = {
  [BASIC]: getBasicDefaultKeyArr,
}
exports.getDefaultKeyArrByType = (bigType) => {
  return map[bigType]()
}

exports.getDefTransCode = (getStructMap = {}, defaultArr) => {
  // console.log('getStructMap', getStructMap)
  return defaultArr.map((it) => {
    // 这是为了兼容后期对按键进行删减或名称修改
    const findItem = getStructMap[it.key]
    return {
      ...it,
      keyCodeArr: findItem ? findItem.keyCodeArr : it.keyCodeArr,
    }
  })
}

exports.object2Array = function (obj = {}) {
  const arr = []
  Object.keys(obj || {}).forEach((it) => {
    arr.push(obj[it])
  })
  return arr
}

exports.getBasicDefaultKeyArr = getBasicDefaultKeyArr
