import { UPDATE_SETTING_DATA } from '@/constant'

const initState = {
  basicShoutCutList: [],
}
/* 
{
  basicShoutCutList
}
*/

const mgState = (state = initState, { type, data }) => {
  switch (type) {
    case UPDATE_SETTING_DATA:
      return {
        ...state,
        ...data,
      }
    default:
      return state
  }
}
export default mgState
