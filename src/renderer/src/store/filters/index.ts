import { defineStore } from 'pinia'
import { filtersState } from '@renderer/store/filters/state'
import { filtersGetters } from '@renderer/store/filters/getters'

export const useFiltersStore = defineStore('filters', {
  state: filtersState(),
  getters: filtersGetters(),
  actions: {
    async setSearchQuery(searchQuery: string) {
      this.searchQuery = searchQuery
    }
  }
})
