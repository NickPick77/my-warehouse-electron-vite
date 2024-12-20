import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { ExposedApi, ExposedListenersApi } from './exportedApi'
import {
  ADD_ITEM_CH,
  GET_ALL_ITEMS_CH,
  CLOSE_PRODUCT_WINDOW_CH,
  ITEM_FINDED_CH,
  OPEN_PRODUCT_WINDOW_CH,
  REMOVE_SELECTED_ITEMS_CH,
  UPDATE_ITEM_CH,
  GET_APP_VERSION_CH,
  REMOVE_ALL_ITEMS_CH,
  SEARCH_ITEMS_CH
} from '../main/channels'

// Custom APIs for renderer
const api: ExposedApi = {
  openProductWindow: (id?) => ipcRenderer.invoke(OPEN_PRODUCT_WINDOW_CH, id),
  closeProductWindow: () => ipcRenderer.invoke(CLOSE_PRODUCT_WINDOW_CH),
  openWebCamModal: () => ipcRenderer.invoke('openWebCamModal'),
  addItem: (item) => ipcRenderer.invoke(ADD_ITEM_CH, item),
  barCodeDetected: (quaggaPayload) => ipcRenderer.invoke('barCodeDetected', quaggaPayload),
  getAllItems: () => ipcRenderer.invoke(GET_ALL_ITEMS_CH),
  removeSelectedItems: (ids) => ipcRenderer.invoke(REMOVE_SELECTED_ITEMS_CH, ids),
  removeAllItems: () => ipcRenderer.invoke(REMOVE_ALL_ITEMS_CH),
  updateItem: (itemDetails) => ipcRenderer.invoke(UPDATE_ITEM_CH, itemDetails),
  searchItems: (searchString: string) => ipcRenderer.invoke(SEARCH_ITEMS_CH, searchString),
  updateHandler: (cmd) => ipcRenderer.invoke('update_handler', cmd)
}

const ipcRendererListenerAPIs: ExposedListenersApi = {
  appUpdate: (callback) => ipcRenderer.on('app_update', callback),
  changeItemSuccess: (callback) => ipcRenderer.on('changeItemSuccess', callback),
  itemFinded: (callback) => ipcRenderer.on(ITEM_FINDED_CH, callback),
  addItemSuccess: (callback) => ipcRenderer.on('addItemSuccess', callback),
  barCodeSuccess: (callback) => ipcRenderer.on('barCodeSuccess', callback),

}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('versions', {
      node: () => process.versions.node,
      chrome: () => process.versions.chrome,
      electron: () => process.versions.electron,
      application: () => ipcRenderer.invoke(GET_APP_VERSION_CH)
    })
    contextBridge.exposeInMainWorld('events', api)
    contextBridge.exposeInMainWorld('ipcRendererListenerAPIs', ipcRendererListenerAPIs)
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
