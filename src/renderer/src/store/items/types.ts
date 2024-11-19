import { type FormPayload, type ItemPayload } from '@renderer/types/items'

export interface ItemsStateType {
  items: ItemPayload[]
  filteredItems: ItemPayload[]
  formPayload: FormPayload
  allItemSelected: boolean
}
