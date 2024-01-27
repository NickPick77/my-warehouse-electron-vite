import { BrowserWindow } from 'electron'

import configureWindow from './config'

const createMainWindow = (preload: string, icon: string) => {
  const mainWindow: BrowserWindow | null = new BrowserWindow({
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

  configureWindow(mainWindow)

  return mainWindow
}

export default createMainWindow
