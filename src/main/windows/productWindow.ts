import { BrowserWindow } from 'electron'
import configureWindow from '../config'

const createProductWindow = (preload: string, icon: string, itemName?: string) => {
  const productWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    icon,
    webPreferences: {
      preload,
      // nodeIntegrationInWorker: true,
      contextIsolation: true
      // webSecurity: false
    }
  })
  if (itemName) {
    configureWindow(productWindow, '#newProduct', itemName)
  } else {
    configureWindow(productWindow, '#newProduct')
  }

  return productWindow
}

export default createProductWindow
