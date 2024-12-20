import { ElectronAPI } from '@electron-toolkit/preload'
import { ExposedApi, ExposedListenersApi, VersionInfo } from '../preload/exportedApi'

declare global {
  interface Window {
    electron: ElectronAPI
    api: unknown
    events: ExposedApi
    ipcRendererListenerAPIs: ExposedListenersApi
    versions: VersionInfo
  }

  interface Node {
    clickOutsideEvent?: (event: Event) => void
  }
}
