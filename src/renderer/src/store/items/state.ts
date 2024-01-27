import { type FormPayload, type ItemPayload } from '@renderer/types/items'

export interface ItemsStateType {
  items: ItemPayload[]
  formPayload: FormPayload
  allItemSelected: boolean
}

export const itemsState = () => {
  return (): ItemsStateType => ({
    items: [
      {
        isSelected: false,
        bar_code: '434343',
        item_name: 'pistola',
        quantity: 0,
        img_url: 'https://picsum.photos/200/300'
      },
      {
        isSelected: false,
        bar_code: '435453452',
        item_name: 'fucile',
        quantity: 5,
        img_url: 'https://picsum.photos/200/300'
      }
    ],
    formPayload: {
      isSelected: false,
      item_name: '',
      quantity: 0,
      fromChange: false
    },
    allItemSelected: false
  })
}
