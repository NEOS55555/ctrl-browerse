const path = require('path')
// 基础的webpack配置
module.exports = {
  module: {
    rules: [
      // ts，tsx，js，jsx处理
      {
        test: /\.[tj]sx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader', // babel-loader处理jsx或tsx文件
          options: { cacheDirectory: true },
        },
      },
      // C++模块 .node文件处理
      {
        test: /\.node$/,
        exclude: /node_modules/,
        use: 'native-ext-loader', // node-loader处理.node文件，用于处理C++模块
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx', '.node'],
    alias: {
      '~native': path.resolve(__dirname, 'native'), // 别名，方便import
      '~resources': path.resolve(__dirname, 'resources'), // 别名，方便import
    },
  },
  devtool: 'source-map',
  plugins: [],
}
