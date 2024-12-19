'use strict'
import { app, autoUpdater, BrowserWindow } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { join } from 'path'

import { createMainWindow } from './windows/index'
import ipcMainHandlers from './ipcMainHandlers'
import db from './database/database'

process.env.ROOT = join(__dirname, '..')
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let mainWindow: BrowserWindow | null
let productWindows: BrowserWindow[] = []
let cameraWindow: BrowserWindow | null

// Preload and Icon path definition
const preload = join(process.env.ROOT, 'preload/index.js')
const icon = join(process.env.ROOT, 'resources/warehouse.png')

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

  mainWindow = createMainWindow(preload, icon)

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) mainWindow = createMainWindow(preload, icon)
  })

  app.on('ready', () => {
    console.log(autoUpdater.getFeedURL())

    autoUpdater.checkForUpdates()
  })

  // Quit when all windows are closed, except on macOS. There, it's common
  // for applications and their menu bar to stay active until the user quits
  // explicitly with Cmd + Q.
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      try {
        db.close()
      } catch (error) {
        console.error('Error closing the database:', error)
      }

      app.quit()
    }
  })

  // Ipc Main Handlers
  ipcMainHandlers(
    preload,
    {
      icon
    },
    { mainWindow, productWindows, cameraWindow }
  )

  autoUpdater.on('checking-for-update', () => {
    console.log('Controllo aggiornamenti...')
  })

  autoUpdater.on('error', (err) => {
    console.error('Errore durante l’update', err)
  })

  // Listeners for Main Window closing events
  mainWindow.on('closed', function () {
    if (productWindows && productWindows.length > 0) {
      productWindows.forEach((win) => {
        if (!win.isDestroyed()) {
          win.close()
        }
      })
      productWindows = []
    }

    if (cameraWindow && !cameraWindow.isDestroyed()) {
      cameraWindow.close()
      cameraWindow = null
    }

    mainWindow = null
  })

  // Listeners for Camera Window closing events
  cameraWindow?.on('closed', () => {
    cameraWindow = null
  })
})
