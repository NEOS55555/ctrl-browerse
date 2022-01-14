import { invoke, ipcOn } from '@/util/ajax'
import { eventBus } from '@/util/eventBus'
import { useEffect, useRef, useState } from 'react'
import './index.scss'

export default function BrowersePage({ url }) {
  const webref = useRef(null)
  const [preloadSrc, setpreloadSrc] = useState('')
  // const [url, seturl] = useState('')
  useEffect(() => {
    invoke('getLocalPreloadPath', 'game.js').then((res) => {
      setpreloadSrc(res)
    })
  }, [setpreloadSrc])
  /* useEffect(() => {
    // ipcOn()
    // seturl('http://localhost:8000/test/test.html')
    // seturl('http://localhost:8000/2.html')
    seturl('https://www.baidu.com')
  }, [seturl]) */

  useEffect(() => {
    ipcOn('input-is-change', function (evt, val) {
      // console.log('webref.current', webref.current, val)
      webref.current.send('input-is-change', val)
    })
    ipcOn('input-is-entry', function (evt) {
      webref.current.send('input-is-entry')
    })

    setTimeout(() => {
      console.log('ooooook')
      webref.current.addEventListener('new-window', (e) => {
        const url = e.url
        console.log('uuuuu', url)
        eventBus.emit('newBrowerse#abc', url)
      })
    }, 500)
  }, [])

  return (
    <div className="content-list-wrapper">
      {preloadSrc && url && (
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
