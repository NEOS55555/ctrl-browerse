const { ipcMain } = require('electron')

let moveData = {}
module.exports = function (mainWindow) {
  ipcMain.handle('global-window-startMove', () => {
    // mainWindow.setPosition(x, y)
    ;[moveData.x, moveData.y] = mainWindow.getPosition()
  })
  ipcMain.handle('global-move-window-position', (evt, { movex, movey }) => {
    mainWindow.setPosition(moveData.x + movex, moveData.y + movey)
  })
}
