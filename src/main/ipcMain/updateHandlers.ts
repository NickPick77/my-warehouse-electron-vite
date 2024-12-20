import { ipcMain } from 'electron'
import { autoUpdater } from 'electron-updater'
import { IpcInvokeResponse } from 'src/main/ipcMain/types'

const updateHandlersService = () => {
  const init = () => {
    ipcMain.handle('update_handler', async (_, cmd: string): Promise<IpcInvokeResponse> => {
      try {
        switch (cmd) {
          case 'checkForUpdates':
            autoUpdater.checkForUpdates()
            break
          case 'downloadUpdate':
            autoUpdater.downloadUpdate()
            break
          case 'installUpdate':
            console.log(cmd)

            autoUpdater.quitAndInstall()
            break
        }
        return { success: true }
      } catch (error) {
        return { success: false, error: (error as Error).message }
      }
    })
  }
  return {
    init
  }
}

export default updateHandlersService
