import { Tooltip } from 'antd'

export default function InputTip({ children, ...args }) {
  return (
    <Tooltip
      {...args}
      placement="bottomLeft"
      title={
        <p>
          推荐使用如下几种方式：
          <br />
          1.F1~F12单键
          <br />
          2.ctrl/shift/alt+字母/数字，组合使用
        </p>
      }
      color="#108ee9"
    >
      {children}
    </Tooltip>
  )
}
