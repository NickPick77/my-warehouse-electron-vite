import { BrowserWindow, ipcMain } from 'electron'
import { ItemPayload } from '../renderer/src/types/items'
import { createProductWindow, createWebCamWindow } from './windows/index'
import {
  getAllItems,
  addItem,
  removeAllItems,
  removeSelectedItems,
  searchItems,
  getItemById,
  updateItem
} from './database/queryHandlers'
import { ADD_ITEM_CH, CLOSE_PRODUCT_WINDOW_CH, ITEM_FINDED_CH, OPEN_PRODUCT_WINDOW_CH, REMOVE_SELECTED_ITEMS_CH, UPDATE_ITEM_CH } from './channels'

export interface IpcInvokeResponse {
  success: boolean
  data?: any
  message?: string
}

// Ipc Main Handlers
const ipcMainHandlers = (
  preload: string,
  config: { icon: string },
  windows: {
    mainWindow: BrowserWindow | null
    productWindows: BrowserWindow[]
    cameraWindow: BrowserWindow | null
  }
) => {
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
        const newProductWindow = createProductWindow(preload, config.icon) as BrowserWindow

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
        ) as BrowserWindow

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

  ipcMain.handle('getAllItems', async () => {
    try {
      const items: ItemPayload[] = await getAllItems()
      return { success: true, items }
    } catch (error) {
      console.error('Error retrieving items:', error)
      return { success: false, error: (error as Error).message }
    }
  })

  ipcMain.handle(ADD_ITEM_CH, async (_, itemDetails: ItemPayload) => {
    try {
      await addItem(itemDetails)
      console.log(`[SUCCESS] addItem:`, { success: true, itemDetails })
      windows.mainWindow?.webContents.send('addItemSuccess')
    } catch (error) {
      console.error(`[ERROR] addItem:`, error)
      windows.mainWindow?.webContents.send('addItemSuccess', (error as Error).message)
    }
  })

  ipcMain.handle('removeAllItems', async () => {
    try {
      await removeAllItems()

      windows.mainWindow?.webContents.send('itemsRemoved', { success: true })
    } catch (error) {
      windows.mainWindow?.webContents.send('itemsRemoved', {
        success: false,
        error: (error as Error).message
      })
    }
  })

  ipcMain.handle(REMOVE_SELECTED_ITEMS_CH, async (_, itemIds: number[]) => {
    try {
      console.log('itemIds:', itemIds)
      await removeSelectedItems(itemIds)
      console.log('item-removed', { success: true })
      windows.mainWindow?.webContents.send('itemRemoved', { success: true })
    } catch (error) {
      console.error('item-removed', { success: false, error: (error as Error).message })
      windows.mainWindow?.webContents.send('itemRemoved', { success: false })
    }
  })

  ipcMain.handle(UPDATE_ITEM_CH, async (_, itemDetails: ItemPayload) => {
    try {
      await updateItem(itemDetails)
      console.log(`[SUCCESS] changeItem:`, { success: true, itemDetails })
      windows.mainWindow?.webContents.send('changeItemSuccess', { success: true })
    } catch (error) {
      console.error(`[ERROR] changeItem:`, error)
      windows.mainWindow?.webContents.send('changeItemSuccess', { success: false })
    }
  })

  ipcMain.handle('searchItems', async (_, searchString: string) => {
    try {
      const items: ItemPayload[] = await searchItems(searchString)

      return { success: true, items }
    } catch (error) {
      console.error('Error retrieving items:', error)
      return { success: false, error: (error as Error).message }
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
