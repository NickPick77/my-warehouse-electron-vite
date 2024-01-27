export interface ItemPayload {
  id?: number
  isSelected: boolean
  bar_code?: string
  item_name: string
  quantity: number | string
  img_url?: string
  img_title?: string
  bar_code_title?: string
}

export interface ProductFormPayload {
  type: 'save' | 'clear'
  formPayload: ItemPayload
}

export interface ItemsDBpayload {
  items: ItemPayload[]
  success: boolean
}
