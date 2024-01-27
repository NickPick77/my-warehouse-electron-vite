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

export interface FormPayload extends ItemPayload {
  fromChange: boolean
}

export interface ProductFormPayload {
  type: 'save' | 'clear'
  formPayload: FormPayload
}

export interface ItemsDBpayload {
  items: ItemPayload[]
  success: boolean
}
