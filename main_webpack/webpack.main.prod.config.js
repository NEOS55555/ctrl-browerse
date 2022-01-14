const path = require('path')
const webpack = require('webpack')
const { merge } = require('webpack-merge')
const nodeExternals = require('webpack-node-externals')
const webpackBaseConfig = require('./webpack.base.config')

module.exports = merge(webpackBaseConfig, {
  devtool: 'none',
  mode: 'production', // 开发模式
  target: 'node',
  entry: path.resolve(__dirname, '../src/main/main.js'),
  output: {
    path: path.resolve(__dirname, '../app/dist/main'),
    filename: 'main.js', // 开发模式文件名为main.dev.js
  },
  externals: [
    nodeExternals({
      // allowlist: ['express'],
    }),
    'infoPath',
  ], // 排除Node模块
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
    }),
  ],
  node: {
    __dirname: false,
    __filename: false,
  },
})
