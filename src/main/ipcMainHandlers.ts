import { BrowserWindow, ipcMain } from 'electron'
import { ItemPayload } from '../renderer/src/types/items'
import createAddProductWindow from './productWindow'
import createWebCamWindow from './webCamWindow'
import { type Database } from 'sqlite3'

// Ipc Main Handlers
const ipcMainHandlers = (
  preload: string,
  config: { icon: string; db: Database },
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

  ipcMain.handle('newProductWindowWithItem', (_, id: number) => {
    if (windows.productWindow && !windows.productWindow.isDestroyed()) {
      windows.productWindow.focus()
    } else {
      config.db.get(
        `
          SELECT *
          FROM items
          WHERE id = ?
        `,
        [id],
        (err, item: ItemPayload) => {
          if (err) {
            console.log("Errore durante il recupero dell'elemento:", err.message)
          } else {
            if (item) {
              windows.productWindow = createAddProductWindow(preload, config.icon) as BrowserWindow

              windows.productWindow.on('ready-to-show', () =>
                windows.productWindow?.webContents.send('itemToChangeFinded', id)
              )
            } else {
              console.log('Nessun elemento trovato con ID:', id)
            }
          }
        }
      )
    }
  })

  ipcMain.handle('closeProductWindow', () => {
    windows.productWindow?.close()
  })

  ipcMain.handle('getAllItems', async () => {
    try {
      const items: ItemPayload[] = await new Promise((resolve, reject) => {
        config.db.all(
          'SELECT id, isSelected, bar_code, item_name, quantity FROM items',
          (err, items: ItemPayload[]) => {
            if (err) {
              reject({ success: false, error: err.message })
            } else {
              resolve(items)
            }
          }
        )
      })
      const parsedItems = items.map((item) => ({
        ...item,
        isSelected: Boolean(item.isSelected)
      }))
      return { success: true, items: parsedItems }
    } catch (error) {
      console.error('Error retrieving items:', error)
      return { success: false, error: (error as Error).message }
    }
  })

  ipcMain.handle('addItem', (_, itemDetails) => {
    const { isSelected, bar_code, item_name, quantity } = itemDetails

    //Inizia una transazione
    config.db.run('BEGIN TRANSACTION')

    // Esegui query nel DB
    config.db.run(
      `
    INSERT INTO items (isSelected, bar_code, item_name, quantity)
    VALUES (?, ?, ?, ?)
  `,
      [isSelected, bar_code, item_name, quantity],
      (err) => {
        if (err) {
          // Annulla la transazione in caso di errore
          config.db.run('ROLLBACK', () =>
            console.log('product-added-rollback', { success: false, error: err.message })
          )
        } else {
          // Committa la transazione se non ci sono errori
          config.db.run('COMMIT', () => console.log('product-added', { success: true }))
        }
      }
    )
    windows.mainWindow?.webContents.send('addItemSuccess')
  })

  ipcMain.handle('removeAllItems', () => {
    config.db.run('DELETE FROM items', (err) => {
      if (err) {
        console.log('items-removed', { success: false, error: err.message })
      } else {
        console.log('items-removed', { success: true })
      }
    })
  })

  ipcMain.handle('removeItem', (_, itemId) => {
    config.db.run('DELETE FROM items WHERE id = ?', [itemId], (err) => {
      if (err) {
        console.log('item-removed', { success: false, error: err.message })
      } else {
        console.log('item-removed', { success: true })
      }
    })
  })

  ipcMain.handle('removeSelectedItems', (_, itemIds) => {
    config.db.serialize(() => {
      const stmt = config.db.prepare('DELETE FROM items WHERE id = ?')
      itemIds.forEach((id) => {
        stmt.run(id, (err) => {
          if (err) {
            console.log('item-removed', { success: false, error: err.message })
          } else {
            console.log('item-removed', { success: true })
          }
        })
      })
      stmt.finalize()
    })
  })

  ipcMain.handle('changeItem', (_, itemDetails: ItemPayload) => {
    const { bar_code, item_name, quantity, id } = itemDetails

    config.db.run(
      `
      UPDATE items
      SET bar_code = ?,
          item_name = ?, 
          quantity = ?
      WHERE id = ?
      `,
      [bar_code, item_name, quantity, id],
      (err) => {
        if (err) {
          console.log('item-modify', { success: false, error: err.message })
        } else {
          console.log('item-modify', { success: true })
        }
      }
    )

    windows.mainWindow?.webContents.send('changeItemSuccess')
  })

  ipcMain.handle('searchItems', async (_, searchString: string) => {
    try {
      const items: ItemPayload[] = await new Promise((resolve, reject) => {
        const searchStringQuery = searchString

        config.db.all(
          `
      SELECT *
      FROM items
      WHERE bar_code || item_name LIKE '%' || ? || '%'
      `,
          [searchStringQuery], // Stringa di ricerca dell'utente
          (err, items: ItemPayload[]) => {
            if (err) {
              console.error('Errore durante il recupero degli elementi:', err)
              reject({ success: false, error: err.message })
            } else {
              if (items.length > 0) {
                console.log('Elementi trovati:', items)
                resolve(items)
              } else {
                console.log('Nessun elemento trovato con la stringa di ricerca specificata.')
                resolve(items)
              }
            }
          }
        )
      })
      const parsedItems = items.map((item) => ({
        ...item,
        isSelected: Boolean(item.isSelected)
      }))
      return { success: true, items: parsedItems }
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
