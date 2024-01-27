import { BrowserWindow, shell } from 'electron'
import { is } from '@electron-toolkit/utils'
import { join } from 'path'

const configureWindow = (window: BrowserWindow, hash = '') => {
  window.webContents.on('did-finish-load', (callback) => {
    if (typeof callback === 'function') {
      callback()
    }
  })

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

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    window.loadURL(`${process.env['ELECTRON_RENDERER_URL']}${hash}`)
    window.webContents.openDevTools()
  } else {
    window.loadFile(join(__dirname, `../renderer/index.html`), { hash: hash })
  }

  if (hash === '#WebCamModal') {
    window.setTitle('My Warehouse - Bar Code WebCam Scanner')
  } else {
    window.setTitle('My Warehouse')
  }
}

export default configureWindow
