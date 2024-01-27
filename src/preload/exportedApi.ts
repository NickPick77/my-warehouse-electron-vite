import { type ItemPayload, type ItemsDBpayload } from '../renderer/src/types/items'
import { type QuaggaImageObject } from '../renderer/src/types/quagga'

export interface ExposedApi {
  newProductWindow: () => Promise<void>
  openWebCamModal: () => Promise<void>
  barCodeDetected: (quaggaPayload: QuaggaImageObject) => Promise<QuaggaImageObject>
  barCodeSuccess: (
    callback: (channel: string, quaggaPayload: QuaggaImageObject) => void
  ) => Promise<void>
  addItemSuccess: (callback: () => void) => Promise<void>
  closeProductWindow: () => Promise<void>
  getAllItems: () => Promise<ItemsDBpayload>
  addItem: (payload: ItemPayload) => Promise<void>
  removeItem: (id: number) => Promise<void>
  removeSelectedItems: (ids: number[]) => Promise<void>
  removeAllItems: () => Promise<void>
}

export interface VersionInfo {
  node: () => string
  chrome: () => string
  electron: () => string
  application: () => string | undefined
}
