import { BrowserWindow } from 'electron'
import configureWindow from './config'

const createAddProductWindow = (preload: string, icon: string) => {
  const productWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    icon,
    webPreferences: {
      preload,
      // nodeIntegrationInWorker: true,
      contextIsolation: true,
      // webSecurity: false
    }
  })

  configureWindow(productWindow, '#newProduct')

  return productWindow
}

export default createAddProductWindow
