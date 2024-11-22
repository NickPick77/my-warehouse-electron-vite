import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { ExposedApi } from './exportedApi'
import { ITEM_FINDED_CH, OPEN_PRODUCT_WINDOW_CH } from '../main/channels'

// Custom APIs for renderer
const api: ExposedApi = {
  openProductWindow: (id?) => ipcRenderer.invoke(OPEN_PRODUCT_WINDOW_CH, id),
  openWebCamModal: () => ipcRenderer.invoke('openWebCamModal'),
  addItem: (item) => ipcRenderer.invoke('addItem', item),
  addItemSuccess: (callback) => ipcRenderer.on('addItemSuccess', callback),
  barCodeSuccess: (callback) => ipcRenderer.on('barCodeSuccess', callback),
  barCodeDetected: (quaggaPayload) => ipcRenderer.invoke('barCodeDetected', quaggaPayload),
  closeProductWindow: () => ipcRenderer.invoke('closeProductWindow'),
  getAllItems: () => ipcRenderer.invoke('getAllItems'),
  removeItem: (id) => ipcRenderer.invoke('removeItem', id),
  removeSelectedItems: (ids) => ipcRenderer.invoke('removeSelectedItems', ids),
  removeAllItems: () => ipcRenderer.invoke('removeAllItems'),
  changeItem: (itemDetails) => ipcRenderer.invoke('changeItem', itemDetails),
  itemFinded: (callback) => ipcRenderer.on(ITEM_FINDED_CH, callback),
  changeItemSuccess: (callback) => ipcRenderer.on('changeItemSuccess', callback),
  searchItems: (searchString: string) => ipcRenderer.invoke('searchItems', searchString)
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('versions', {
      node: () => process.versions.node,
      chrome: () => process.versions.chrome,
      electron: () => process.versions.electron,
      application: () => process.env.npm_package_version
      // we can also expose variables, not just functions
    })
    contextBridge.exposeInMainWorld('events', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.events = api
}

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector: string, text: string) => {
    console.log(selector, text)
  }

  for (const dependency of ['chrome', 'node', 'electron']) {
    replaceText(`${dependency}-version`, process.versions[dependency] as string)
  }
})
