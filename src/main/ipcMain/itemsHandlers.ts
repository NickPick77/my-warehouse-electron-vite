import { type BrowserWindow as BrowserWindowType, ipcMain } from 'electron'
import {
  getAllItems,
  addItem,
  removeAllItems,
  removeSelectedItems,
  searchItems,
  updateItem
} from '../database/queryHandlers'
import {
  ADD_ITEM_CH,
  GET_ALL_ITEMS_CH,
  REMOVE_SELECTED_ITEMS_CH,
  UPDATE_ITEM_CH,
  REMOVE_ALL_ITEMS_CH,
  SEARCH_ITEMS_CH
} from '../channels'

import type { ItemPayload } from '../../renderer/src/types/items'

const itemsHandersService = (mainWindow: BrowserWindowType | null) => {
  const init = () => {
    ipcMain.handle(GET_ALL_ITEMS_CH, async () => {
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
        mainWindow?.webContents.send('addItemSuccess')
      } catch (error) {
        console.error(`[ERROR] addItem:`, error)
        mainWindow?.webContents.send('addItemSuccess', (error as Error).message)
      }
    })

    ipcMain.handle(REMOVE_ALL_ITEMS_CH, async () => {
      try {
        await removeAllItems()

        mainWindow?.webContents.send('itemsRemoved', { success: true })
      } catch (error) {
        mainWindow?.webContents.send('itemsRemoved', {
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
        mainWindow?.webContents.send('itemRemoved', { success: true })
      } catch (error) {
        console.error('item-removed', { success: false, error: (error as Error).message })
        mainWindow?.webContents.send('itemRemoved', { success: false })
      }
    })

    ipcMain.handle(UPDATE_ITEM_CH, async (_, itemDetails: ItemPayload) => {
      try {
        await updateItem(itemDetails)
        console.log(`[SUCCESS] changeItem:`, { success: true, itemDetails })
        mainWindow?.webContents.send('changeItemSuccess', { success: true })
      } catch (error) {
        console.error(`[ERROR] changeItem:`, error)
        mainWindow?.webContents.send('changeItemSuccess', { success: false })
      }
    })

    ipcMain.handle(SEARCH_ITEMS_CH, async (_, searchString: string) => {
      try {
        const items: ItemPayload[] = await searchItems(searchString)

        return { success: true, items }
      } catch (error) {
        console.error('Error retrieving items:', error)
        return { success: false, error: (error as Error).message }
      }
    })
  }
  return {
    init
  }
}

export default itemsHandersService
