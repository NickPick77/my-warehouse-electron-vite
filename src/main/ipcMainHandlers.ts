import { BrowserWindow, ipcMain } from 'electron'
import { ItemPayload } from '../renderer/src/types/items'
import createAddProductWindow from './productWindow'
import createWebCamWindow from './webCamWindow'
import {
  getAllItems,
  addItem,
  removeAllItems,
  removeItem,
  removeSelectedItems,
  searchItems,
  newProductWindowWithItem
} from './database/queryHandlers'

// Ipc Main Handlers
const ipcMainHandlers = (
  preload: string,
  config: { icon: string; },
  windows: {
    mainWindow: BrowserWindow | null
    productWindow: BrowserWindow | null
    cameraWindow: BrowserWindow | null
  }
) => {
  ipcMain.handle('newProductWindow', () => {
    if (windows.productWindow && !windows.productWindow.isDestroyed()) {
      windows.productWindow.focus()
    } else {
      windows.productWindow = createAddProductWindow(preload, config.icon) as BrowserWindow
    }
  })

  ipcMain.handle('newProductWindowWithItem', async (_, id: number) => {
    try {
      if (windows.productWindow && !windows.productWindow.isDestroyed()) {
        windows.productWindow.focus()
        return
      }

      const item = await newProductWindowWithItem(id)

      if (item) {
        windows.productWindow = createAddProductWindow(preload, config.icon) as BrowserWindow

        windows.productWindow.on('ready-to-show', () => {
          windows.productWindow?.webContents.send('itemToChangeFinded', item)
        })

        return { success: true, message: 'Window created', item }
      } else {
        console.log('Nessun elemento trovato con ID:', id)
        return { success: false, error: 'Item not found' }
      }
    } catch (error) {
      console.error('Errore durante la creazione della finestra:', (error as Error).message)
      return { success: false, error: (error as Error).message }
    }
  })

  ipcMain.handle('closeProductWindow', () => {
    windows.productWindow?.close()
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

  ipcMain.handle('addItem', async (_, itemDetails: ItemPayload) => {
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

  ipcMain.handle('removeItem', async (_, itemId: number) => {
    try {
      await removeItem(itemId)
      console.log('item-removed', { success: true })
      windows.mainWindow?.webContents.send('itemRemoved', { success: true })
    } catch (error) {
      console.error('item-removed', { success: false, error: (error as Error).message })
      windows.mainWindow?.webContents.send('itemRemoved', { success: false })
    }
  })

  ipcMain.handle('removeSelectedItems', async (_, itemIds: number[]) => {
    try {
      await removeSelectedItems(itemIds)
      console.log('item-removed', { success: true })
      windows.mainWindow?.webContents.send('itemRemoved', { success: true })
    } catch (error) {
      console.error('item-removed', { success: false, error: (error as Error).message })
      windows.mainWindow?.webContents.send('itemRemoved', { success: false })
    }
  })

  ipcMain.handle('changeItem', async (_, itemDetails: ItemPayload) => {
    try {
      await addItem(itemDetails)
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

  ipcMain.handle('barCodeDetected', (_, quaggaPayload) => {
    windows.productWindow?.webContents.send('barCodeSuccess', quaggaPayload)
    if (windows.cameraWindow) {
      windows.cameraWindow.close()
    }
  })
}

export default ipcMainHandlers
