import { _GettersTree } from 'pinia'
import type { ItemsStateType } from '@renderer/store/items/state'
import type { ItemPayload } from '@renderer/types/items'

export const itemsGetters: () => _GettersTree<ItemsStateType> = () => ({
  getItems: (state: ItemsStateType) => state.items,
  getFilteredItems: (state: ItemsStateType) => state.filteredItems,
  getAllItemSelected: (state: ItemsStateType) => state.allItemSelected,
  getAllSelectedItems: (state: ItemsStateType) =>
    state.items.filter((item: ItemPayload) => item.isSelected),
  getFormPayload: (state: ItemsStateType) => state.formPayload
})
