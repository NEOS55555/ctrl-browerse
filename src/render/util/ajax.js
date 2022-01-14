import { ipcRenderer } from 'electron'

export const invoke = (channel, ...args) => ipcRenderer.invoke(channel, ...args)
export const ipcOn = (evt, handler) => ipcRenderer.on(evt, handler)
export const ipcRemoveAllListeners = (listener) =>
  ipcRenderer.removeAllListeners(listener)
