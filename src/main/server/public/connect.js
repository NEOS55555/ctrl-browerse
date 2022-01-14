;(() => {
  function initWs(uri) {
    var ws
    let isOpen = false
    let arr = []
    var onOpencb
    init()
    let onmessageCb = function () {}
    function init() {
      try {
        ws = new WebSocket(uri)
      } catch (e) {
        console.log('eeeee')
        console.log(e)
      }
      ws.onopen = function (evt) {
        console.log('Connection open ...')
        isOpen = true
        opend()
        onOpencb && onOpencb()
      }
      ws.onerror = function () {
        // console.log('重连 error')
      }

      ws.onmessage = function (evt) {
        console.log('Received Message: ' + evt.data)
        // ws.close()
        const jsdata = evt.data
        /* try {
          jsdata = JSON.parse(jsdata)
        } catch (e) {
          console.log('eee', e)
        } */
        onmessageCb(jsdata)
      }

      ws.onclose = function (evt) {
        console.log('Connection closed.')
        setTimeout(() => {
          init()
        }, 500)
      }
    }
    function opend() {
      for (let i = 0; i < arr.length; i++) {
        arr[i]()
      }
      arr = []
    }

    return {
      init,
      isOpen() {
        return isOpen
      },
      onOpen(cb) {
        onOpencb = cb
      },
      send(agv) {
        if (isOpen) {
          ws.send(agv)
        } else {
          arr.push(() => ws.send(agv))
        }
      },
      onmessage(cb) {
        onmessageCb = cb
      },
    }
  }

  //

  const input = document.createElement('input')
  document.addEventListener('readystatechange', function () {
    if (document.readyState === 'complete') {
      document.body.appendChild(input)
      // document.body.appendChild(button)
      input.style.display = 'none'
    }
  })

  window.QWS_CONNECT = function () {
    const cbMap = {}
    let wsBase = null
    // 创建
    // const button = document.createElement('button')
    // button.innerText = '确定'

    /* button.onclick = function () {
      wsBase.send(JSON.stringify({ type: 'b2c-input-entry' }))
    } */
    // input监听事件
    var timmer = null
    let isInput = false
    input.addEventListener('input', function (e) {
      cbMap.onCtrlInputChange && cbMap.onCtrlInputChange()
      clearTimeout(timmer)
      timmer = setTimeout(() => {
        cbMap.onCtrlInputChangeOver && cbMap.onCtrlInputChangeOver()
        wsBase.send(
          JSON.stringify({ type: 'b2c-input-change', value: e.target.value })
        )
      }, 300)
    })
    input.addEventListener('focus', () => {
      cbMap.onCtrlInputBlur && cbMap.onCtrlInputBlur()
    })
    // wsBase.send('aaaaaa')

    input.addEventListener('blur', () => {})
    return {
      newPage(url) {
        wsBase.send(JSON.stringify({ type: 'b2c-newPage', url }))
      },
      setDefaultShowUrl(url) {
        wsBase.send(JSON.stringify({ type: 'b2c-setDefaultShowUrl', url }))
      },
      nextPage() {
        wsBase.send(JSON.stringify({ type: 'b2c-nextPage' }))
      },
      prevPage() {
        wsBase.send(JSON.stringify({ type: 'b2c-prevPage' }))
      },
      connect(wsurl) {
        wsBase = initWs(wsurl)
        wsBase.onmessage((str) => {
          const json = JSON.parse(str)

          switch (json.type) {
            case 'input-is-focus':
              input.style.display = 'block'
              input.value = json.val
              input.focus()
              cbMap.onFocuscb && cbMap.onFocuscb(input)
              break
            case 'input-is-blur':
              input.style.display = 'none'
              cbMap.onBlurcb && cbMap.onBlurcb(input)
              break
            default:
          }
        })
      },
      onBrowserInputFocus(cb) {
        cbMap.onFocuscb = cb
      },
      onBrowserInputBlur(cb) {
        cbMap.onBlurcb = cb
      },
      onCtrlInputBlur(cb) {
        cbMap.onCtrlInputBlur = cb
      },
      onCtrlInputChange(cb) {
        cbMap.onCtrlInputChange = cb
      },
      onCtrlInputChangeOver(cb) {
        cbMap.onCtrlInputChangeOver = cb
      },
      hide() {
        input.style.display = 'none'
      },
      inputRef() {
        return input
      },
    }
  }
})()
