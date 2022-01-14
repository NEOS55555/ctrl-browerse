import { fullScreenObj } from '@/util'
import { invoke, ipcOn } from '@/util/ajax'
import { eventBus } from '@/util/eventBus'
import { useEffect, useRef, useState } from 'react'
import './index.scss'
import dialogComp from '@/components/dialog'
import { Input } from 'antd'

const urlArr = []
let urlIndex = 0
let isEtry = false

ipcOn('new-broserse-page', (evt, url) => {
  // eventBus.emit('newPage#abc', url)
  fullScreenObj.toFullScreen()
  urlArr.push(url)
  document.querySelector('#ruleGrapwebview').loadURL(url)
})

function Index() {
  const webref = useRef(null)
  const [preloadSrc, setpreloadSrc] = useState('')
  const [url, seturl] = useState('')
  useEffect(() => {
    invoke('getLocalPreloadPath', 'game.js').then((res) => {
      setpreloadSrc(res)
    })
  }, [setpreloadSrc])
  useEffect(() => {
    invoke('getDefaultUrl').then((url) => {
      if (url) {
        seturl(url)
        fullScreenObj.toFullScreen()
      } else {
        seturl('http://localhost:8989/info.html')
      }
    })
    // ipcOn()
    // seturl('http://localhost:8000/test/test.html')
    // seturl('http://localhost:8000/2.html')

    /* eventBus.on('newPage#abc', (url) => {
      seturl(url)
      urlIndex++
      urlArr.push(url)
      console.log('isEtry', isEtry)
    }) */
  }, [seturl])

  useEffect(() => {
    ipcOn('input-is-change', function (evt, val) {
      // console.log('webref.current', webref.current, val)
      webref.current.send('input-is-change', val)
    })
    ipcOn('input-is-entry', function (evt) {
      webref.current.send('input-is-entry')
    })
    /* ipcOn('broserse-nextPage',function () {

    }) */
    ipcOn('broserse-prevPage', function (evt) {
      // webref.current.send('input-is-entry')
      console.log('urlArr', urlArr)
      if (urlArr.length <= 1) {
        return
      }
      const [url] = urlArr.splice(urlArr.length - 2, 1)
      if (url) {
        webref.current.loadURL(url)
      }
    })

    setTimeout(() => {
      console.log('ooooook')
      isEtry = true
      webref.current.addEventListener('new-window', (e) => {
        const url = e.url
        webref.current.loadURL(url)
        urlArr.push(url)
      })
    }, 500)
  }, [])

  return (
    <div className="content-list-wrapper1">
      {preloadSrc && (
        <webview
          ref={webref}
          id="ruleGrapwebview"
          src={url}
          // enableremotemodule="true"
          // useragent={ua}
          preload={preloadSrc}
          style={{ width: '100%', height: '100%' }}
          sandbox="allow-forms allow-scripts allow-same-origin allow-popups"
        ></webview>
      )}
    </div>
  )
}

export default Index
