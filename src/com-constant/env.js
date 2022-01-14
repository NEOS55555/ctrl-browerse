// 开发环境
exports.isDev =
  process.env.NODE_ENV === 'development' 

// 生产环境
exports.isProd = process.env.NODE_ENV === 'production'
