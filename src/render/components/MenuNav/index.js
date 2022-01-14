import { addClass, removeClass } from '@/util'
import { useCallback, useEffect, useRef } from 'react'
import './index.scss'
// let prevNode = null
function getNodeVal(curNode) {
  return curNode.getAttribute('data-menu-id')
}
export default function MenuNav({
  topChildren,
  style,
  defaultValue,
  children,
  onChange,
}) {
  const prevNode = useRef(null)
  const ulref = useRef(null)
  const menuClick = useCallback(
    (e) => {
      const curNode = e.target
      const val = getNodeVal(curNode)
      if (val === getNodeVal(prevNode.current)) {
        return
      }
      addClass(curNode, 'active')
      removeClass(prevNode.current, 'active')
      prevNode.current = curNode

      onChange && onChange(val)
    },
    [onChange, prevNode]
  )
  useEffect(() => {
    const lisNodes = ulref.current.querySelectorAll('.menu-li')
    for (let i = lisNodes.length; i--; ) {
      const curNode = lisNodes[i]
      if (getNodeVal(curNode) === defaultValue) {
        addClass(curNode, 'active')
        prevNode.current = curNode
        return
      }
    }
  }, [defaultValue])

  // children.props.onClick = (e) => console.log(e)
  return (
    <div className="menu-nav-warpper" style={style}>
      {topChildren}
      <ul className="menu-list" ref={ulref} onClick={menuClick}>
        {children}
      </ul>
    </div>
  )
}

function MenuNavLi({ val, children }) {
  return (
    <li className="menu-li" data-menu-id={val}>
      {children}
    </li>
  )
}

export { MenuNavLi }
