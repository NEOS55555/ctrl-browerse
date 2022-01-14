const {
  escapeSpecChart,
  isManga,
  isBook,
  isVideoType,
  getbyType,
  combUrl,
} = require('../../../com-function')
const { getListBy$List, getIdByUrl } = require('../../lib/util')
const {
  get$aurl,
  get$name,
  getHrefRuleByNode,
  get$imgSrc,
  get$total,
} = require('./func')
const { invokerInvoke, send } = require('./ajax')

var $ = require('jquery')
window.$ = $
window.jquery = $

// 搜索的
exports.searchFunction = function () {
  invokerInvoke.invoke('diy-getSearchRuleData').then((mgData) => {
    send('可以了啊，怎么不发送啊，搜索的', mgData.stage)
    switch (mgData.stage) {
      case 'index':
        invokerInvoke.invoke('diy-searchRule2NextStage').then(() => {
          const searchRule = mgData.grap.index
          window.$(searchRule.searchInput).val(mgData.params.searchval)
          setInterval(() => {
            window.$(searchRule.searchOkBtn)[0].click()
          }, 500)
        })

        break
      case 'search':
        {
          const rule = mgData.grap.search
          const list = getListBy$List(
            window.$(rule.list).find(rule.item),
            ($li) => {
              let obj = {}
              try {
                // send('$li', get$aurl($li, rule.item, rule.url), rule.url)
                obj = {
                  bgType: getbyType(mgData.info.bigType),
                  id: getIdByUrl(
                    get$aurl($li, rule.item, rule.url),
                    mgData.info.url
                  ),
                  name: escapeSpecChart(get$name($li, rule.item, rule.name)),
                  // cover: addHttp($a.attr('data-original')),
                }
              } catch (e) {
                send(e)
              }
              return obj
            },
            'id'
          )
          // send(list)

          invokerInvoke.invoke('diy-setSearchList', {
            list,
          })
          // .then(() => send('okkkkk'))
        }
        break
      default:
    }
  })
}
// 章节列表的
// 这是漫画和小说的样子
exports.listFunction = function (key) {
  invokerInvoke.invoke('diy-getRuleData', key).then((mgData) => {
    send('可以了啊，怎么不发送啊，列表的，', key, mgData.stage)
    switch (mgData.stage) {
      case 'list':
        {
          const rule = mgData.grap.list
          const list = getListBy$List(
            window.$(rule.list).find(rule.item),
            ($li) => {
              let obj = {}
              // send('$li', $li.length)
              try {
                // send('$li', get$aurl($li, rule.item, rule.url), rule.url)
                obj = {
                  bgType: getbyType(mgData.info.bigType),
                  url: getIdByUrl(
                    get$aurl($li, rule.item, rule.url),
                    mgData.info.url
                  ),
                  title: escapeSpecChart(get$name($li, rule.item, rule.name)),
                  // cover: addHttp($a.attr('data-original')),
                }
              } catch (e) {
                send(e)
              }
              return obj
            }
          )
          send('setListList', list.length)

          invokerInvoke.invoke('diy-setList', key, {
            list,
          })
          // .then(() => send('okkkkk'))
        }
        break
      default:
    }
  })
}
// 详情的
exports.detailFunction = function (key) {
  invokerInvoke.invoke('diy-getRuleData', key).then((mgData) => {
    send('可以了啊，怎么不发送啊，详情的，', key, mgData)
    switch (mgData.stage) {
      case 'detail':
        try {
          setTimeout(() => {
            const rule = mgData.grap.detail
            const data = {}
            // send('data4', '来数据了')
            // const {info: {bigType}} = mgData
            if (isManga(mgData.info.bigType)) {
              // send('data4', '来数据了', get$imgSrc(rule.content))
              let imgsrc = get$imgSrc(rule.content)
              send('imgsrc', imgsrc)

              if (imgsrc) {
                data.content = combUrl(imgsrc, mgData.currentHref)
              }
            } else if (isBook(mgData.info.bigType)) {
              data.content = window.$(rule.content).text()
            }
            send('--data4', '来数据了，走到pagerule')
            // getHrefRuleByNode
            // send('data4', 'pageRuleObj', rule.pageRule)
            const pageRuleObj = getHrefRuleByNode(rule.pageRule) || {}
            send('--data4', 'pageRuleObj', pageRuleObj)
            if (pageRuleObj.rule) {
              // data.pageRule = combUrl(pageRuleObj.rule, mgData.currentHref)
              if (pageRuleObj.type == 'srs') {
                const [rule, spcIdx] = pageRuleObj.rule.split('。')
                let url = mgData.currentHref.split('')
                url.splice(url.length - parseInt(spcIdx), 0, rule)
                url = url.join('')
                data.pageRule = url
              } else {
                data.pageRule = combUrl(pageRuleObj.rule, mgData.currentHref)
              }
            }
            // data.correctMar = pageRuleObj.correctMar || 0

            data.total = get$total(rule.total)
            send('----', '当前数据', mgData.currentHref)
            send('--data4', '来数据了', data)

            invokerInvoke.invoke('diy-setList', key, data)
          }, 4000)
        } catch (e) {
          invokerInvoke.invoke('diy-setList', key, {})
          send(e)
        }

        break
      default:
    }
  })
}
