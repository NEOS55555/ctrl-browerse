// 开发环境
export const isDev =
  process.env.NODE_ENV === 'development' &&
  process.env.REACT_APP_NODE_ENV === 'development'
// mock本地环境
export const isMock =
  process.env.NODE_ENV === 'development' &&
  process.env.REACT_APP_NODE_ENV === 'mock'
// 生产环境
export const isProd = process.env.NODE_ENV === 'production'

export const STATIC_PATH = process.env.REACT_APP_STATIC_PATH
