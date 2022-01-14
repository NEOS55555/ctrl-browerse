import React, { useState } from 'react'
import {
  LineOutlined,
  BorderOutlined,
  CloseOutlined,
  SwitcherOutlined,
  SlidersOutlined,
} from '@ant-design/icons'

import './index.scss'
import { ipcRenderer } from 'electron'

export default function TopNav() {
  const [isMax, setIsMax] = useState(false)
  const [isToTop, setIsToTop] = useState(false)
  function windowClose() {
    ipcRenderer.invoke('window-close')
  }
  function windowMin() {
    ipcRenderer.invoke('window-min')
  }
  function windowMax() {
    ipcRenderer.invoke('window-max')
    setIsMax(!isMax)
  }
  function windowToTop() {
    ipcRenderer.invoke('window-toTop')
    setIsToTop(!isToTop)
  }

  return (
    <div className="top-nav" id="top-nav">
      <div className="move-bar no-drag"></div>
      <div className="tip-title">
        {/* <img src={icon} className="icon" alt="" /> */}
        <span>{'ctrl-browerse'}</span>
      </div>
      {/* <Menu /> */}
      <ul className="opera-btn-list no-drag clear">
        <li
          onClick={windowToTop}
          title="置顶"
          className={isToTop ? 'active' : ''}
        >
          <SlidersOutlined />
        </li>
        <li onClick={windowMin} title="缩小">
          <LineOutlined />
        </li>
        <li onClick={windowMax} title="放大">
          {isMax ? <SwitcherOutlined /> : <BorderOutlined />}
        </li>
        <li className="close" onClick={windowClose} title="关闭">
          <CloseOutlined />
        </li>
      </ul>
    </div>
  )
}
