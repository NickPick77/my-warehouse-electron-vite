import { _GettersTree } from 'pinia'
import type { FiltersStateType } from '@renderer/store/filters/state'

export const filtersGetters: () => _GettersTree<FiltersStateType> = () => ({
  getSearchQuery: (state: FiltersStateType) => state.searchQuery
})
