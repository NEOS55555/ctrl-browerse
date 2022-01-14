import { Component, useEffect, useState } from 'react'
import { ArrowLeftOutlined } from '@ant-design/icons'
import './index.scss'

export default class Detail extends Component {
  state = {
    visible: false,
  }
  show = () => {
    this.setState({
      visible: true,
    })
  }
  hide = () => {
    this.setState({
      visible: false,
    })
  }

  render() {
    const { visible } = this.state
    return (
      <div className={'detail-wrapper ' + (visible ? 'active' : '')}>
        <div className="return" onClick={this.hide}>
          <ArrowLeftOutlined />
        </div>
        <div className="detail-content">{this.props.children}</div>
      </div>
    )
  }
}
