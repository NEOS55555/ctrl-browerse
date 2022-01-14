// import router from '@/router'
import TopNav from '@/components/TopNav'
import { routes } from '@/router'
import { ipcOn } from '@/util/ajax'
import { globalEvtMap } from '@/util/com'
import { RouteWithRoutes } from '@/util/routerUtil'
import { message } from 'antd'
import 'antd/dist/antd.css'
import { useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import './App.scss'

ipcOn('global-key-event', (evt, key) => {
  console.log(key)
  globalEvtMap[key] && globalEvtMap[key]()
})
ipcOn('global-info-send', (evt, it) => {
  message[it.type](it.info)
})
/* ipcOn('message', (evt, msg) => {
  // message.success(JSON.stringify(msg))
  document.querySelector('#abc').innerHTML =
    document.querySelector('#abc').innerHTML +
    JSON.stringify(msg, '', '\t') +
    '<br/>'
}) */
function _psKeydownEvent(event) {
  const { keyCode } = event
  console.log(event.keyCode)
  /* this.keyCodeShortcuts.forEach((item) => {
    // console.log(item)
    if (item.keyCodeArr.indexOf(keyCode) !== -1) {
      item.event ? this[item.event](item.key) : this[item.key]()
    }
  }) */
  // console.log('keyCode', keyCode)

  switch (keyCode) {
    case 122:
      event.preventDefault()
      break
    default:
      break
  }
  // console.log(event.keyCode)
}
function App() {
  useEffect(() => {
    window.addEventListener('keydown', _psKeydownEvent)
  }, [])
  return (
    <>
      <TopNav></TopNav>
      {/* <div id="abc"></div> */}
      <RouteWithRoutes routes={routes} />
    </>
  )
}

export default withRouter(App)
