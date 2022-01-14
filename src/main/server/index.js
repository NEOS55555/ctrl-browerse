const path = require('path')
const express = require('express')
const { isDev } = require('../../com-constant/env')

module.exports = function () {
  const app = express()
  // console.log(path.resolve(__dirname, './public'))
  app.use(express.static(path.resolve(__dirname, isDev ? './public' : './server/public')))
  app.listen(8989)
}
