// import { menuList } from '@/constant'

import { UPDATE_COM_DATA } from '@/constant'

const initState = {
  isShowMenu: true,
}
const comState = (state = initState, { type, data }) => {
  switch (type) {
    case UPDATE_COM_DATA:
      return {
        ...state,
        ...data,
      }
    default:
      return state
  }
}

export default comState
