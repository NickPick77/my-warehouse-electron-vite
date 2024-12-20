import { type BrowserWindow as BrowserWindowType, BrowserWindow, ipcMain, app } from 'electron'
import { createProductWindow, createWebCamWindow } from '../windows/index'
import itemsHandersService from './itemsHandlers'
import updateHandlersService from './updateHandlers'

import { getItemById } from '../database/queryHandlers'
import {
  CLOSE_PRODUCT_WINDOW_CH,
  ITEM_FINDED_CH,
  OPEN_PRODUCT_WINDOW_CH,
  GET_APP_VERSION_CH
} from '../channels'

import type { IpcInvokeResponse } from '../ipcMain/types'

// Ipc Main Handlers
const ipcMainHandlers = (
  preload: string,
  config: { icon: string },
  windows: {
    mainWindow: BrowserWindowType | null
    productWindows: BrowserWindowType[]
    cameraWindow: BrowserWindowType | null
  }
) => {
  itemsHandersService(windows.mainWindow).init()

  updateHandlersService().init()

  ipcMain.handle(GET_APP_VERSION_CH, () => {
    try {
      return app.getVersion()
    } catch (error) {
      console.error('Error getting app version:', error)
      return (error as Error).message
    }
  })

  ipcMain.handle(OPEN_PRODUCT_WINDOW_CH, async (_, id: number): Promise<IpcInvokeResponse> => {
    try {
      const existingProductWindow = windows.productWindows.find((win) => {
        console.log('win.title:', win.title)

        let winId: string | null = null
        if (win.title.includes(':')) {
          const titleParts = win.title.split(':')
          winId = titleParts.length > 1 ? titleParts[1] : null
        }

        const idStr = id !== undefined && id !== null ? id.toString() : null

        // Gestione dei casi:
        // 1. Entrambi winId e idStr sono null (finestre senza ID)
        // 2. Entrambi winId e idStr sono definiti e uguali
        // 3. Altri casi (non corrispondenti)
        if (winId === idStr && !win.isDestroyed()) {
          return true
        } else if (winId === null && idStr === null && !win.isDestroyed()) {
          return true
        } else {
          return false
        }
      })

      if (existingProductWindow) {
        existingProductWindow.focus()

        return { success: true, message: 'Product Window already exists' }
      }

      if (!id) {
        const newProductWindow = createProductWindow(preload, config.icon) as BrowserWindowType

        newProductWindow.on('closed', () => {
          console.log('La finestra del prodotto è stata chiusa')
          windows.productWindows = windows.productWindows.filter((win) => win !== newProductWindow)
        })

        windows.productWindows?.push(newProductWindow)

        return { success: true, message: 'Window created' }
      }

      const item = await getItemById(id)

      if (item) {
        const newProductWindow = createProductWindow(
          preload,
          config.icon,
          `${item.item_name}:${item.id}`
        ) as BrowserWindowType

        newProductWindow.on('closed', () => {
          console.log('La finestra del prodotto è stata chiusa')
          windows.productWindows = windows.productWindows.filter((win) => win !== newProductWindow)
        })

        windows.productWindows.push(newProductWindow)

        newProductWindow.webContents.on('did-finish-load', () => {
          newProductWindow.webContents.send(ITEM_FINDED_CH, item)
        })

        return { success: true, message: 'Window created', data: item }
      } else {
        return { success: false, message: 'Item not found' }
      }
    } catch (error) {
      return { success: false, message: (error as Error).message }
    }
  })

  ipcMain.handle(CLOSE_PRODUCT_WINDOW_CH, (event) => {
    const window = BrowserWindow.fromWebContents(event.sender)
    if (window && !window.isDestroyed()) {
      window.close()
    }
  })

  ipcMain.handle('openWebCamModal', () => {
    if (windows.cameraWindow && !windows.cameraWindow.isDestroyed()) {
      windows.cameraWindow.focus()
    } else {
      windows.cameraWindow = createWebCamWindow(preload, config.icon)
    }
  })

  ipcMain.handle('barCodeDetected', (event, quaggaPayload) => {
    const window = BrowserWindow.fromWebContents(event.sender)
    window?.webContents.send('barCodeSuccess', quaggaPayload)
    if (windows.cameraWindow) {
      windows.cameraWindow.close()
    }
  })
}

export default ipcMainHandlers
