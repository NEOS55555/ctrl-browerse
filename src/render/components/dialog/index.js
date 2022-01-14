import React, { Component } from 'react'
import { Modal } from 'antd'
import ReactDOM from 'react-dom'

class Dialog extends Component {
  state = {
    confirmLoading: false,
    visible: false,
    title: '',
    content: '',
  }
  show = (config = {}) => {
    this.setState({
      visible: true,
      ...config,
    })
  }
  showLoading = () => {
    this.setState({
      confirmLoading: true,
    })
  }
  hideLoading = () => {
    this.setState({
      confirmLoading: false,
    })
  }
  hide = () => {
    this.setState({
      confirmLoading: false,
      visible: false,
      footer: undefined,
    })
  }
  render() {
    const { content } = this.state
    return (
      <Modal
        onCancel={this.hide}
        maskClosable={false}
        {...this.state}
        // title={title}
        // footer={footer}
        // visible={visible}
        // onOk={onOk}
        // confirmLoading={confirmLoading}
        okText="确定"
        cancelText="取消"
      >
        <div>{content}</div>
      </Modal>
    )
  }
}

let div = document.createElement('div')
let props = {}
document.body.appendChild(div)

let dialogComp = ReactDOM.render(React.createElement(Dialog, props), div)

export default dialogComp
