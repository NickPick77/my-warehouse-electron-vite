import { _GettersTree } from 'pinia'
import type { ItemsStateType } from '@renderer/store/items/state'
import type { ItemPayload } from '@renderer/types/items'

// Definizione del tipo dell'oggetto ItemType
export interface ItemType {
  // ... definizione dei campi dell'oggetto
  isSelected: boolean
}

// Definizione del tipo per i getter
export interface ItemsGetters {
  getItems(state: ItemsStateType): ItemType[]
  getAllItemSelected(state: ItemsStateType): boolean
  getAllSelectedItems(state: ItemsStateType): ItemType[]
}

export const itemsGetters: _GettersTree<ItemsStateType> = {
  getItems: (state: ItemsStateType) => state.items,
  getAllItemSelected: (state: ItemsStateType) => state.allItemSelected,
  getAllSelectedItems: (state: ItemsStateType) =>
    state.items.filter((item: ItemPayload) => item.isSelected)
}
