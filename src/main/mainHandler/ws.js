const { ipcMain } = require('electron')
var ws = require('nodejs-websocket')
const { setData } = require('../util/store')
function json2obj(str) {
  return JSON.stringify(str)
}
function str2json(str) {
  return JSON.parse(str)
}
// Scream server example: "hi" -> "HI!!!"
module.exports = function (mainWindow) {
  let connArr = []
  let id = 0
  ipcMain.handle('input-is-focus', (e, oriVal) => {
    connArr.forEach((conn) => {
      conn.sendText(json2obj({ type: 'input-is-focus', val: oriVal }))
    })
  })
  ipcMain.handle('input-is-blur', (e, oriVal) => {
    connArr.forEach((conn) => {
      conn.sendText(json2obj({ type: 'input-is-blur', val: oriVal }))
    })
  })
  var server = ws
    .createServer(function (conn) {
      console.log('New connection')
      // connArr.push(conn)
      connArr = [conn]
      conn.on('text', function (str) {
        const data = str2json(str)
        switch (data.type) {
          case 'b2c-input-change':
            mainWindow.webContents.send('input-is-change', data.value)
            break
          case 'b2c-input-entry':
            mainWindow.webContents.send('input-is-entry')
            break
          case 'b2c-newPage':
            // mainWindow.setFullScreen(true)
            mainWindow.webContents.send('new-broserse-page', data.url)
            break
          case 'b2c-setDefaultShowUrl':
            // mainWindow.setFullScreen(true)
            // mainWindow.webContents.send('new-broserse-page', data.url)
            setData(['defaultUrl'], data.url)
            break
          case 'b2c-prevPage':
            mainWindow.webContents.send('broserse-prevPage')
            break
          case 'b2c-nextPage':
            mainWindow.webContents.send('broserse-nextPage')
            break
          default:
        }
        console.log('Received ' + str)
        console.log('Received ', data)
        // conn.sendText(str.toUpperCase() + '!!!')
        // mainWindow.webContents.send('global-key-event', evt)
      })
      conn.on('close', function (code, reason) {
        /* const idx = connArr.findIndex((it) => it === conn)
        if (idx > -1) {
          connArr.splice(idx, 1)
        } */
        console.log('Connection closed')
      })
      conn.on('error', function (code, err) {
        console.log('error', err)
      })
    })
    .listen(33253)
}
