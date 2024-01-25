import { ElectronAPI } from '@electron-toolkit/preload'
import { ExposedApi, VersionInfo } from '../preload/exportedApi'

declare global {
  interface Window {
    electron: ElectronAPI
    api: unknown
    events: ExposedApi
    versions: VersionInfo
  }
}
