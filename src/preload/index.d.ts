import { ElectronAPI } from '@electron-toolkit/preload'
import { ExposedApi, VersionInfo } from './exportedApi'

declare global {
  interface Window {
    electron: ElectronAPI
    api: unknown
    events: ExposedApi
    versions: VersionInfo
  }
}
