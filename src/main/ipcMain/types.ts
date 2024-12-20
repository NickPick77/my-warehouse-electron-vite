export interface IpcInvokeResponse {
  success: boolean
  data?: any
  message?: string
  error?: Error | string
}

export interface AutoUpdaterResponse {
  message: string
  status: string
  isAvailable: boolean
  [key: string]: any
}
