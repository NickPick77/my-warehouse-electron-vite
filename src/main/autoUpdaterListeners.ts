import { type BrowserWindow } from 'electron'
import { autoUpdater } from 'electron-updater'

const autoUpdaterListenersOn = (mainWindow: BrowserWindow | null) => {
  autoUpdater.on('checking-for-update', () => {
    console.log('Checking for update...')
    mainWindow?.webContents.send('app_update', {
      message: 'Checking for update...',
      status: 'checking',
      isAvailable: false
    })
  })

  autoUpdater.on('update-available', (info) => {
    mainWindow?.webContents.send('app_update', {
      message: 'Update available.',
      status: 'downloading',
      isAvailable: true,
      ...info
    })
  })

  autoUpdater.on('download-progress', (info) => {
    mainWindow?.webContents.send('app_update', {
      message: 'Download in progress...',
      status: 'downloading',
      isAvailable: true,
      ...info
    })
  })

  autoUpdater.on('update-not-available', (info) => {
    mainWindow?.webContents.send('app_update', {
      message: 'Update not available.',
      status: 'idle',
      isAvailable: false,
      ...info
    })
  })

  autoUpdater.on('error', (err) => {
    mainWindow?.webContents.send('app_update', {
      message: 'Error in auto-updater. ',
      status: 'idle',
      isAvailable: false,
      err
    })
  })

  autoUpdater.on('update-downloaded', (info) => {
    console.log('Update downloaded')
    mainWindow?.webContents.send('app_update', {
      message: 'Update downloaded',
      status: 'downloaded',
      isAvailable: true,
      ...info
    })
  })
}

export default autoUpdaterListenersOn
