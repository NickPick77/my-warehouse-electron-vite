import { IpcRendererEvent } from 'electron'
import { AutoUpdaterResponse } from 'src/main/ipcMain/types'

import type { QuaggaImageObject } from 'src/renderer/src/types/quagga'
import type { ItemPayload, ItemsDBpayload } from 'src/renderer/src/types/items'
import type { IpcInvokeResponse } from 'src/main/ipcMain/types'

export interface ExposedApi {
  openProductWindow: (id?: number) => Promise<IpcInvokeResponse>
  openWebCamModal: () => Promise<void>
  barCodeDetected: (quaggaPayload: QuaggaImageObject) => Promise<QuaggaImageObject>
  closeProductWindow: () => Promise<void>
  getAllItems: () => Promise<ItemsDBpayload>
  addItem: (payload: ItemPayload) => Promise<void>
  removeSelectedItems: (ids: number[]) => Promise<void>
  removeAllItems: () => Promise<void>
  updateItem: (itemDetails: ItemPayload) => Promise<void>
  searchItems: (searchString: string) => Promise<ItemsDBpayload>
  updateHandler: (cmd: string) => Promise<void>
}

export interface ExposedListenersApi {
  barCodeSuccess: (
    callback: (event: IpcRendererEvent, quaggaPayload: QuaggaImageObject) => void
  ) => void
  addItemSuccess: (callback: () => void) => void
  itemFinded: (callback: (_: IpcRendererEvent, itemDetails: ItemPayload) => void) => void
  changeItemSuccess: (callback: () => void) => void
  appUpdate: (callback: (_: IpcRendererEvent, updateInfo: AutoUpdaterResponse) => void) => void
}

export interface VersionInfo {
  node: () => string
  chrome: () => string
  electron: () => string
  application: () => Promise<string>
}
