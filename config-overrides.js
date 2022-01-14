const webpack = require('webpack')
const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
/* const {
  override,
  adjustStyleLoaders,
  addWebpackAlias,
  addWebpackPlugin,
} = require('customize-cra') */
// console.log(process.env.NODE_ENV2)
const distPath = path.resolve(__dirname, './app/dist/render')
const paths = require('react-scripts/config/paths')
paths.appBuild = distPath

module.exports = function (config, env) {
  // console.log(config.output)
  config.output.publicPath = './'
  config.resolve.alias = {
    '@': path.resolve('src/render'),
  }
  config.plugins.push(
    new CleanWebpackPlugin({
      default: [distPath],
    }),
    new webpack.ExternalsPlugin('commonjs', ['electron'])
  )

  config.module.rules.forEach((rr) => {
    // console.log(rr)
    if (rr.oneOf) {
      rr.oneOf.forEach((rule) => {
        if (rule.test && rule.test.toString().includes('scss')) {
          rule.use.push({
            loader: require.resolve('sass-resources-loader'),
            options: {
              resources: './src/render/assets/css/default.scss', //这里是你自己放公共scss变量的路径
            },
          })
        }
      })
    }
  })
  /* config.plugins.push(
    new webpack.DefinePlugin({
      'process.env': JSON.stringify({
        // NODE_ENV: process.env.NODE_ENV,
        REACT_APP_FOO_ABC: '123',
      }),
    })
  ) */
  // console.log(config)

  return config
  /* return override(
    adjustStyleLoaders((rule) => {
      if (rule.test.toString().includes('scss')) {
        rule.use.push({
          loader: require.resolve('sass-resources-loader'),
          options: {
            resources: './src/assets/css/default.scss', //这里是你自己放公共scss变量的路径
          },
        })
      }
    }),
    addWebpackPlugin(
      new webpack.DefinePlugin({
        'process.env': JSON.stringify({
          NODE_ENV: process.env.NODE_ENV,
          REACT_APP_FOO_ABC: '123',
        }),
      })
    ),
    addWebpackAlias({
      '@': path.resolve('src'),
    })
  ) */
}
