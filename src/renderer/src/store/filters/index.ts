import { defineStore } from 'pinia'
import type { FiltersStateType } from '@renderer/store/filters/types'

export const useFiltersStore = defineStore('filters', {
  state: (): FiltersStateType => ({
    searchQuery: ''
  }),
  getters: {
    getSearchQuery: (state: FiltersStateType) => state.searchQuery
  },
  actions: {
    async setSearchQuery(searchQuery: string) {
      this.searchQuery = searchQuery
    }
  }
})
