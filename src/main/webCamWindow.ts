import { BrowserWindow } from 'electron'
import configureWindow from './config'

const createWebCamWindow = (preload: string, icon: string) => {
  const cameraWindow = new BrowserWindow({
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

  return cameraWindow
}

export default createWebCamWindow
