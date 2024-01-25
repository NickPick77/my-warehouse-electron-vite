import { ElectronAPI } from '@electron-toolkit/preload'
import { type ItemPayload, type ItemsDBpayload } from './types/items'
import { type QuaggaImageObject } from './types/quagga'

export interface ExposedApi {
  newProductWindow: () => Promise<void>
  openWebCamModal: () => Promise<void>
  openWebCamModal: () => Promise<void>
  barCodeDetected: (quaggaPayload) => Promise<QuaggaImageObject>
  barCodeSuccess: (callback) => Promise<void>
  addItemSuccess: (callback) => Promise<void>
  closeProductWindow: () => Promise<void>
  getAllItems: () => Promise<ItemsDBpayload>
  addItem: (payload: ItemPayload) => Promise<void>
  removeItem: (id: number) => Promise<void>
  removeSelectedItems: (ids: number[]) => Promise<void>
  removeAllItems: () => Promise<void>
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: unknown
    events: ExposedApi
  }
}
