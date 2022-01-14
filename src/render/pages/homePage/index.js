import BrowersePage from '@/components/BrowersePage'
import { fullScreenObj } from '@/util'
import { ipcOn } from '@/util/ajax'
import { eventBus } from '@/util/eventBus'
import { Tabs } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import './index.scss'

const { TabPane } = Tabs

const initialPanes = [
  /* { title: 'Tab 1', content: 'Content of Tab 1', key: '1' },
  { title: 'Tab 2', content: 'Content of Tab 2', key: '2' },
  {
    title: 'Tab 3',
    content: 'Content of Tab 3',
    key: '3',
    closable: false,
  }, */
]

/* ipcOn('new-broserse-page', (evt, url) => {
  eventBus.emit('newBrowerse#abc', url)
}) */

function _psKeydownEvent(event) {
  const { keyCode } = event
  // console.log(event.keyCode, this.keyCodeShortcuts)
  /* this.keyCodeShortcuts.forEach((item) => {
    // console.log(item)
    if (item.keyCodeArr.indexOf(keyCode) !== -1) {
      item.event ? this[item.event](item.key) : this[item.key]()
    }
  }) */
  // console.log('keyCode', keyCode)
  switch (keyCode) {
    /* case 74:
      ipcRenderer.invoke('toggle-show-window')
      break */
    case 122:
      event.returnValue = false
      fullScreenObj.toggleFullScreen('f11')
      break
    default:
  }
  // console.log(event.keyCode)
}

let newTabIndex = 0
let prevActiveKey = ''
export default function HomePage() {
  const [panes, setpanes] = useState(initialPanes)
  const [activeKey, setactiveKey] = useState((initialPanes[0] || {}).key)

  const add = (url) => {
    prevActiveKey = activeKey
    const activeKey1 = `newTab${newTabIndex++}`
    // panes.push()
    if (panes.length > 20) {
      panes.shift()
    }
    setpanes([
      ...panes,
      {
        title: 'New Tab',
        content: <BrowersePage url={url}></BrowersePage>,
        key: activeKey1,
      },
    ])
    setactiveKey(activeKey1)
  }
  const remove = (targetKey) => {
    // const { panes, activeKey } = this.state;
    let newActiveKey = activeKey
    let lastIndex
    panes.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1
      }
    })
    const newPanes = panes.filter((pane) => pane.key !== targetKey)
    if (newPanes.length && newActiveKey === targetKey) {
      if (lastIndex >= 0) {
        newActiveKey = newPanes[lastIndex].key
      } else {
        newActiveKey = newPanes[0].key
      }
    }
    setpanes(newPanes)
    setactiveKey(newActiveKey)
  }

  const onEdit = (targetKey, action) => {
    console.log('action', action, targetKey)
    if (action == 'remove') {
      remove(targetKey)
    } else {
      add(targetKey)
    }
  }
  useEffect(() => {
    console.log('addaddaddadd')
    eventBus.on('newBrowerse#abc', (url) => {
      add(url)
    })
  }, [add])
  useEffect(() => {
    console.log('addaddaddadd')
    eventBus.on('getback#abc', () => {
      setactiveKey(prevActiveKey)
    })
  }, [setactiveKey])

  useEffect(() => {
    window.addEventListener('keydown', _psKeydownEvent)
  }, [])

  return (
    <Tabs
      type="editable-card"
      onChange={(e) => {
        prevActiveKey = activeKey
        setactiveKey(e)
      }}
      activeKey={activeKey}
      onEdit={onEdit}
    >
      {panes.map((pane) => (
        <TabPane tab={pane.title} key={pane.key} closable={pane.closable}>
          {pane.content}
        </TabPane>
      ))}
    </Tabs>
  )
}
