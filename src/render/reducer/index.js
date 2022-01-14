import com from './state/com'
import setting from './state/setting'
import combineReducers from './combineReducers'
const { Provider, useRedux } = combineReducers({ com, setting })

export { Provider, useRedux }
