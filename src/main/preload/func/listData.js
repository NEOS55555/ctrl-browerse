const { listArrMap } = require('../../../com-constant/ruleconst')
const { combUrl, isBook } = require('../../../com-function')
const { getHrefRuleByNode, get$imgSrc } = require('./func')
const { invokerInvoke } = require('./ajax')
const activeClassName = 'q-active-border'
var $ = window.$

let nodePathMap = {}
function setPath(key, val) {
  // send('window.currentPageAttr', window.currentPageAttr, nodePathMap)
  nodePathMap[window.currentPageAttr] =
    nodePathMap[window.currentPageAttr] || {}
  nodePathMap[window.currentPageAttr][key] = val
}
function getPath(key) {
  return (nodePathMap[window.currentPageAttr] || {})[key]
}

function send(...args) {
  invokerInvoke.invoke('cos', ...args)
}

function get$Item() {
  const pamth = getPath('list') + ' ' + getPath('item')
  if (pamth.indexOf('undefined') != -1) {
    return
  }
  return window.$(pamth)
}

function isEqual$itemBykey(key) {
  return getPath('item') == getPath(key)
}

function urlcheck() {
  let $a = null
  let $node = get$Item()
  if (!$node) {
    window.curMsg('只有选择前两个之后，才可以检测')
    return
  }
  if (!isEqual$itemBykey(this.key)) {
    $node = $node.find(getPath(this.key)).eq(0)
    send('不等啊')
  } else {
    $node = $node.eq(0)
  }
  if ($node.length == 0) {
    window.curMsg('没有获取到节点信息！')
    return
  }

  if ($node[0].tagName.toLocaleLowerCase() == 'a') {
    $a = $node
  } else {
    let temp = $node.find('a').eq(0)
    if (temp.length > 0) {
      $a = temp
    } else {
      $a = $node.parents('a').eq(0)
    }
  }
  let url = $a.addClass(activeClassName).attr('href')
  if (url) {
    const a = new URL(url, window.location.href)
    url = a.toString()
    send('urlcheck地址', url)
    window.curMsg(
      '获取的链接为：' + url + '<br>即将打开，从红框中获取的链接',
      () => {
        $a.removeClass(activeClassName)
      }
    )
    invokerInvoke.invoke('openEdge', url)
  } else {
    window.curMsg('没有获取到地址！', () => {
      $a.removeClass(activeClassName)
    })
  }
}

function namecheck() {
  let $node = get$Item()
  if (!$node) {
    window.curMsg('只有选择前两个之后，才可以检测')
    return
  }
  if (!isEqual$itemBykey(this.key)) {
    $node = $node.find(getPath(this.key))
  }
  $node = $node.eq(0).addClass(activeClassName)
  window.curMsg('从红框中，获取的名称是：<br>' + $node.text(), function() {
    $node.removeClass(activeClassName)
  })
}
function itemcheck() {
  let $node = get$Item()
  if (!$node) {
    window.curMsg('只有选择前列表之后，才可以检测')
    return
  }
  $node.addClass(activeClassName)
  window.curMsg(
    '画红圈的为标记出来的，<br/>' +
    this.name +
    '，<br/>总共有' +
    $node.length +
    '个。',
    function() {
      $node.removeClass(activeClassName)
    }
  )
}
function contentCheck() {
  // send('nodePathMap', nodePathMap)

  let imgSrc = get$imgSrc(getPath(this.key))
  if (!imgSrc) {
    window.curMsg('获取图片信息失败')
    return
  }

  imgSrc = combUrl(imgSrc, window.location.href)

  // $node.addClass(activeClassName)
  window.curMsg('图片地址是<br/>' + imgSrc, function() {
    // $node.removeClass(activeClassName)
  })
}

function totalCheck() {
  const $node = window.$(getPath(this.key)).addClass(activeClassName)
  send('this.key', this.key)
  let total = $node.text()
  window.curMsg(
    `根据当前节点<br/>获取到的总数是：${total}，<br>如果获取的数量不对，可以手动修改`,
    function() {
      $node.removeClass(activeClassName)
    }
  )
}

const checkMap = {
  item: itemcheck,
  name: namecheck,
  url: urlcheck,
}

const checkMapByKey = {
  searchInput: indexSearchInputCheck,
  searchOkBtn: indexSearchOkBtnCheck,
  pageRule: pageRuleCheck,
  content: contentCheck,
  total: totalCheck,
}

function indexSearchInputCheck() {
  let $node = window.$(getPath('searchInput'))
  if (!$node) {
    window.curMsg('只有先选择，才可以检测')
    return
  }
  $node.addClass(activeClassName)
  $node.val('游戏王')
  window.curMsg('画红圈标记出来的，并且已经输入名称', function() {
    $node.removeClass(activeClassName)
  })
}
function indexSearchOkBtnCheck() {
  let $node = window.$(getPath('searchOkBtn'))
  if (!$node) {
    window.curMsg('只有先选择，才可以检测')
    return
  }
  $node.addClass(activeClassName)
  window.curMsg(
    '画红圈标记出来的，点击确定之后将会跳转到搜索结果页面。<br/>如果未跳转，则表明按钮位置不对',
    function() {
      $node[0].click()
      setInterval(() => {
        $node[0].click()
      }, 500)
    }
  )
}

function pageRuleCheck() {
  try {
    const ruleObj = getHrefRuleByNode(getPath(this.key))
    if (!ruleObj) {
      return window.curMsg('没有获取到分页的规则')
    }
    const curIndex = 1
    const pageIndex = curIndex + ruleObj.margin
    const a = new URL(
      ruleObj.rule.replace('${pageIndex}', pageIndex),
      window.location.href
    )
    const url = a.toString()
    send(window.location.href)
    invokerInvoke.invoke('openEdge', url)
    window.curMsg(
      '成功获取到分页规则，即将在浏览器打开第一页<br/>如果不是第一页，那么请在输入框输入当前是第几页<br/><input id="pageRuleMargin" type="number" value="' +
      curIndex +
      '"/>',
      function() {
        // 校正值
        let correctMar = parseInt(window.$('#pageRuleMargin').val())
        correctMar = isNaN(correctMar) ? 0 : correctMar
        correctMar = curIndex - correctMar
        invokerInvoke.invoke(
          'setRule',
          window.currentPageAttr,
          'correctMar',
          correctMar
        )
      }
    )
  } catch (e) {
    send(e)
  }
}

function getlistArrMap() {
  return invokerInvoke.invoke('getGrapRuleData').then((data = {}) => {
    const res = data.grap || {}
    //
    const isbk = isBook(data.info.bigType)
    nodePathMap = res
    const listArrMapTemp = { ...listArrMap }
    // send('------', listArrMapTemp)

    Object.keys(listArrMapTemp).forEach((type) => {
      listArrMapTemp[type] = listArrMapTemp[type].map((it) => ({
        ...it,
        // click: it.key == 'pageRule' ? pageRuleClick : false,
        check:
          type == 'search' || type == 'list'
            ? checkMap[it.key]
            : checkMapByKey[it.key],
        active: !!(res[type] || {})[it.key],
      }))
      if (type == 'detail') {
        if (isbk) {
          listArrMapTemp[type] = listArrMapTemp[type].slice(0, 1)
        }
      }
    })
    send('listArrMapTemp', 'listArrMapTemp', listArrMapTemp)

    return listArrMapTemp
  })
}

exports.activeClassName = activeClassName
exports.send = send
exports.getlistArrMap = getlistArrMap
exports.setPath = setPath
exports.getPath = getPath
exports.getCurNodePath = getCurNodePath
exports.getCurNodeAllAtr = getCurNodeAllAtr

function getClassStr(node) {
  let clsstr = [...node.classList].join('.')
  if (clsstr) {
    clsstr = '.' + clsstr
  }
  return clsstr
}
function getIdStr(node) {
  let idstr = node.id || ''
  if (idstr) {
    idstr = '#' + idstr
  }
  return idstr
}
function getCurNodeAllAtr(node) {
  return node.tagName.toLocaleLowerCase() + getClassStr(node) + getIdStr(node)
}

function getCurNodePath(node) {
  if (!node) {
    return
  }
  var a = ''
  const $node = window.$(node)
  const $list = $node.parents()
  for (let i = $list.length; i--;) {
    a += getCurNodeAllAtr($list[i]) + ' '
  }

  a += getCurNodeAllAtr(node)
  const eqi = getCurrentEq(a, node)
  if (eqi) {
    a += ':nth-of-type(' + eqi + ')'
  }
  return a
}

function getCurrentEq(path, node) {
  var $list = window.$(path)
  const len = $list.length
  if (len == 1) {
    return
  }
  for (let i = 0; i < len; i++) {
    if (node == $list[i]) {
      return i + 1
    }
  }
}
