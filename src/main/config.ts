import { BrowserWindow, shell } from 'electron'
import { is } from '@electron-toolkit/utils'
import { join } from 'path'

const configureWindow = (window: BrowserWindow, hash = '', itemName?: string) => {
  window.webContents.on('did-finish-load', () => {
    console.log('did-finish-load', window.title.split(':')[1])
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
    const filePath = join(__dirname, '..', 'renderer', 'index.html');
    window.loadFile(filePath, { hash: hash })
  }

  switch (hash) {
    case '#WebCamModal':
      window.setTitle('My Warehouse - Bar Code WebCam Scanner')
      break
    case '#newProduct':
      const title = itemName
        ? `My Warehouse - Edit Product ${itemName}`
        : 'My Warehouse - Add Product'
      window.setTitle(title)
      window.center()
      break
    default:
      break
  }
}

export default configureWindow
