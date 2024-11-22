import { BrowserWindow, shell } from 'electron'
import { is } from '@electron-toolkit/utils'
import { join } from 'path'

const configureWindow = (window: BrowserWindow, hash = '') => {
  window.webContents.on('did-finish-load', () => {
    console.log('did-finish-load')
  })

  if (hash === '') {
    window.maximize()
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

  switch (hash) {
    case '#WebCamModal':
      window.setTitle('My Warehouse - Bar Code WebCam Scanner')
      break
    case '#ProductModal':
      window.setTitle('My Warehouse - Add Product')
      break
    default:
      break
  }
}

export default configureWindow
