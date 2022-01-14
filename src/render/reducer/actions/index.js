import { UPDATE_COM_DATA, UPDATE_SETTING_DATA } from '@/constant'
// console.log(UPDATE_COM_DATA, menuList)
export const updateComData = (data) => ({ type: UPDATE_COM_DATA, data })
export const updateSetData = (data) => ({ type: UPDATE_SETTING_DATA, data })
