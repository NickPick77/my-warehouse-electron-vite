import { IpcRendererEvent } from 'electron'
import { type ItemPayload, type ItemsDBpayload } from '../renderer/src/types/items'
import { type QuaggaImageObject } from '../renderer/src/types/quagga'
import { IpcInvokeResponse } from '../main/ipcMainHandlers'

export interface ExposedApi {
  openProductWindow: (id?: number) => Promise<IpcInvokeResponse>
  openWebCamModal: () => Promise<void>
  barCodeDetected: (quaggaPayload: QuaggaImageObject) => Promise<QuaggaImageObject>
  barCodeSuccess: (
    callback: (event: IpcRendererEvent, quaggaPayload: QuaggaImageObject) => void
  ) => void
  addItemSuccess: (callback: () => void) => void
  closeProductWindow: () => Promise<void>
  getAllItems: () => Promise<ItemsDBpayload>
  addItem: (payload: ItemPayload) => Promise<void>
  removeItem: (id: number) => Promise<void>
  removeSelectedItems: (ids: number[]) => Promise<void>
  removeAllItems: () => Promise<void>
  changeItem: (itemDetails: ItemPayload) => Promise<void>
  itemFinded: (callback: (_: IpcRendererEvent, itemDetails: ItemPayload) => void) => void
  changeItemSuccess: (callback: () => void) => void
  searchItems: (searchString: string) => Promise<ItemsDBpayload>
}

export interface VersionInfo {
  node: () => string
  chrome: () => string
  electron: () => string
  application: () => string | undefined
}
