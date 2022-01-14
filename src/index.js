import React from 'react'
import ReactDOM from 'react-dom'
import App from './render/pages/App'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/es/locale/zh_CN'
import { Provider } from './render/reducer'
import { BrowserRouter as Router, HashRouter } from 'react-router-dom'
// console.log(process.env)
ReactDOM.render(
  <ConfigProvider locale={zhCN}>
    <Provider>
      <HashRouter>
        <App />
      </HashRouter>
    </Provider>
  </ConfigProvider>,
  document.getElementById('root')
)
