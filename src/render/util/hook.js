import { useCallback, useEffect, useRef } from 'react'
import { specKeyMap } from '../../com-constant/keyCodeMap'
import { invoke } from './ajax'

export function useDebounce(fn, delay = 500, firstCb) {
  const { current } = useRef({ fn, timer: null, isFristEval: false })
  useEffect(() => {
    current.fn = fn
  }, [fn])

  const gomov = useCallback((...args) => {
    if (!current.isFristEval) {
      firstCb && firstCb()
      current.isFristEval = true
    }
    if (current.timer) {
      clearTimeout(current.timer)
    }
    current.timer = setTimeout(() => {
      current.isFristEval = false
      current.fn.call(this, ...args)
    }, delay)
  }, [])
  gomov.clear = () => {
    current.isFristEval = false
    clearTimeout(current.timer)
  }
  return gomov
}
function updateList(list, item, key = 'key') {
  const tmpList = list.map((it) => {
    if (it[key] === item[key]) {
      return {
        ...it,
        ...item,
      }
    }
    return it
  })
  return tmpList
}

export { updateList }
