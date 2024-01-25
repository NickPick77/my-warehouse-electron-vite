'use strict'
import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
// import icon from '../../resources/icon.png?asset'
import { Database } from 'sqlite3'
import { type Database as DatabaseType } from 'sqlite3'
import { ItemPayload } from '../renderer/src/types/items'

process.env.ROOT = join(__dirname, '..')
process.env.ELECTRON = join(process.env.ROOT, 'electron')
process.env.DIST = join(process.env.ROOT, 'dist-electron')
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.ROOT, 'public')
  : join(process.env.ROOT, '.output/public')
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let mainWindow: BrowserWindow | null
let productWindow: BrowserWindow | null
let cameraWindow: BrowserWindow | null

let db: DatabaseType
const preload = join(process.env.ROOT, 'preload/index.js')
const icon = join(process.env.ROOT, 'resources/warehouse.png')

const configureWindow = (window, hash = '') => {
  window.webContents.on('did-finish-load', (callback) => {
    if (typeof callback === 'function') {
      callback()
    }
  })
  console.log(join(app.getAppPath(), 'items.db'))
  console.log(app.getAppPath())

  if (hash === '') {
    window.maximize()
  }

  if (hash === '#WebCamModal') {
    window.setTitle('My Warehose - Bar Code WebCam Scanner')
  }

  window.on('ready-to-show', () => {
    window.show()
  })

  window.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  console.log(process.env['ELECTRON_RENDERER_URL'])
  console.log('production load file', join(__dirname, `../renderer/index.html${hash}`))

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    window.loadURL(`${process.env['ELECTRON_RENDERER_URL']}${hash}`)
    window.webContents.openDevTools()

    // if (hash !== '#WebCamModal') {
    //   window.webContents.openDevTools()
    // }
  } else {
    window.loadFile(join(__dirname, `../renderer/index.html${hash}`))
  }

  // if (is.dev && process.env.VITE_DEV_SERVER_URL) {
  //   window.loadURL(`${process.env.VITE_DEV_SERVER_URL}${hash}`)
  //   if (hash !== '#WebCamModal') {
  //     window.webContents.openDevTools()
  //   }
  // } else {
  //   window.loadFile(join(process.env.VITE_PUBLIC as string, `index.html${hash}`))
  //   window.webContents.openDevTools()
  // }

  if (hash === '#WebCamModal') {
    window.setTitle('My Warehose - Bar Code WebCam Scanner')
  }
}

const createMainWindow = () => {
  mainWindow = new BrowserWindow({
    icon,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload,
      nodeIntegrationInWorker: true,
      contextIsolation: true,
      webSecurity: false,
      sandbox: false
    }
  })

  // join(app.getAppPath(), 'items.db')

  const appPath = app.getAppPath().replace('app.asar', 'items.sqlite')

  const dbPath = appPath
  db = new Database(dbPath)
  db.run(`
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      isSelected INTEGER NOT NULL,
      bar_code TEXT,
      item_name TEXT NOT NULL,
      quantity INTEGER
    )
  `)

  configureWindow(mainWindow)

  mainWindow.on('close', function () {
    mainWindow = null
    productWindow = null
  })

  mainWindow.on('closed', function () {
    mainWindow = null
    productWindow = null
  })
}
const createAddProductWindow = () => {
  if (productWindow && !productWindow.isDestroyed()) {
    productWindow.focus()
    return
  }
  productWindow = new BrowserWindow({
    width: 430,
    height: 600,
    frame: false,
    icon,
    webPreferences: {
      preload,
      nodeIntegrationInWorker: true,
      contextIsolation: true,
      webSecurity: false
    }
  })

  configureWindow(productWindow, '#newProduct')

  productWindow.on('close', () => {
    productWindow = null
  })

  productWindow.on('closed', () => {
    productWindow = null
  })
}

const createWebCamWindow = () => {
  if (cameraWindow && !cameraWindow.isDestroyed()) {
    cameraWindow.focus()
    return
  }

  cameraWindow = new BrowserWindow({
    width: 620,
    height: 420,
    frame: true,
    icon,
    webPreferences: {
      preload,
      nodeIntegrationInWorker: true,
      contextIsolation: true,
      webSecurity: false
    }
  })

  configureWindow(cameraWindow, '#WebCamModal')

  cameraWindow.on('close', () => {
    cameraWindow = null
  })

  cameraWindow.on('closed', () => {
    cameraWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createMainWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow()
  })

  // Ipc Main Handlers
  ipcMain.handle('newProductWindow', () => {
    createAddProductWindow()
  })

  ipcMain.handle('closeProductWindow', () => {
    productWindow?.close()
  })

  ipcMain.handle('getAllItems', async () => {
    try {
      const items: ItemPayload[] = await new Promise((resolve, reject) => {
        db.all(
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
    db.run(
      `
    INSERT INTO items (isSelected, bar_code, item_name, quantity)
    VALUES (?, ?, ?, ?)
  `,
      [isSelected, bar_code, item_name, quantity],
      (err) => {
        if (err) {
          console.log('product-added', { success: false, error: err.message })
        } else {
          console.log('product-added', { success: true })
        }
      }
    )
    mainWindow?.webContents.send('addItemSuccess')
  })

  ipcMain.handle('removeAllItems', () => {
    db.run('DELETE FROM items', (err) => {
      if (err) {
        console.log('items-removed', { success: false, error: err.message })
      } else {
        console.log('items-removed', { success: true })
      }
    })
  })

  ipcMain.handle('removeItem', (_, itemId) => {
    db.run('DELETE FROM items WHERE id = ?', [itemId], (err) => {
      if (err) {
        console.log('item-removed', { success: false, error: err.message })
      } else {
        console.log('item-removed', { success: true })
      }
    })
  })

  ipcMain.handle('removeSelectedItems', (_, itemIds) => {
    db.serialize(() => {
      const stmt = db.prepare('DELETE FROM items WHERE id = ?')
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

  ipcMain.handle('openWebCamModal', () => {
    createWebCamWindow()
  })

  ipcMain.handle('barCodeDetected', (_, quaggaPayload) => {
    productWindow?.webContents.send('barCodeSuccess', quaggaPayload)
    if (cameraWindow) {
      cameraWindow.close()
    }
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
