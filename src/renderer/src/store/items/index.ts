import { defineStore } from 'pinia'
import type { ItemsStateType } from '@renderer/store/items/types'
import { useFiltersStore } from '../filters'

import { type ItemPayload } from '@renderer/types/items'

const {
  getAllItems,
  addItem,
  removeAllItems,
  removeSelectedItems,
  updateItem,
  searchItems,
} = window.events

export const useItemsStore = defineStore('items', {
  state: (): ItemsStateType => ({
    items: [],
    filteredItems: [],
    formPayload: {
      isSelected: false,
      item_name: '',
      quantity: 0,
      caliber: '',
      category: '',
      purchase_price: 0,
      selling_price: 0,
      fromChange: false
    },
    allItemSelected: false
  }),
  getters: {
    getItems: (state: ItemsStateType) => state.items,
    getFilteredItems: (state: ItemsStateType) => state.filteredItems,
    getAllItemSelected: (state: ItemsStateType) => state.allItemSelected,
    getAllSelectedItems: (state: ItemsStateType) =>
      state.items.filter((item: ItemPayload) => item.isSelected),
    getFormPayload: (state: ItemsStateType) => state.formPayload
  },
  actions: {
    async initItemsStore() {
      const { items } = await getAllItems()
      console.log('getted', items)

      this.items = [...items]

      items.forEach((item) => {
        console.log(item)

        this.filteredItems = this.filteredItems.filter(
          (filteredItem) => filteredItem.id === item.id
        )
      })

      //Handlers for home filters required
    },
    async clearAllItems() {
      this.allItemSelected = false

      await removeAllItems()

      await this.initItemsStore()
    },
    async clearSelectedItems(ids: number[]) {
      await removeSelectedItems(ids)

      await this.initItemsStore()
    },
    async handleAddItem(item: ItemPayload) {
      try {
        const existingItem = this.items.find((storedItem: ItemPayload) => storedItem.id === item.id)

        console.log(item.quantity)

        if (existingItem) {
          await updateItem(item)
        } else {
          await addItem(item)
        }
      } catch (error) {
        console.error('Error adding item:', error)
      }
    },
    async handleSelectItem(id: ItemPayload['id']) {
      this.items.find((item: ItemPayload) => {
        if (item.id === id) {
          item.isSelected = !item.isSelected
        }
      })

      this.filteredItems.find((item: ItemPayload) => {
        if (item.id === id) {
          item.isSelected = !item.isSelected
        }
      })
    },
    async handleSelectAllItems() {
      this.items.forEach((item) => {
        if (this.allItemSelected) {
          item.isSelected = false
          return
        }

        if (!this.allItemSelected) {
          item.isSelected = true
          return
        }
      })

      this.allItemSelected = !this.allItemSelected
    },
    async setProductData(item: ItemPayload) {
      this.formPayload = { ...item }
    },
    async handleSearchItems() {
      const searchQuery = useFiltersStore().getSearchQuery

      const { items } = await searchItems(searchQuery)

      console.log(items)

      this.filteredItems = [...items]
    },
    async clearFilteredItems() {
      this.filteredItems = []
    }
  }
})
