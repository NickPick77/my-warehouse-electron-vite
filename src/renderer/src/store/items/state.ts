import { type FormPayload, type ItemPayload } from '@renderer/types/items'

export interface ItemsStateType {
  items: ItemPayload[]
  filteredItems: ItemPayload[]
  formPayload: FormPayload
  allItemSelected: boolean
}

export const itemsState = () => {
  return (): ItemsStateType => ({
    items: [],
    filteredItems: [],
    formPayload: {
      isSelected: false,
      item_name: '',
      quantity: 0,
      fromChange: false
    },
    allItemSelected: false
  })
}
