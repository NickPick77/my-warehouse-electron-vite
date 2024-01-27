import { defineStore } from 'pinia'
import { itemsState } from '@renderer/store/items/state'
import { itemsGetters } from '@renderer/store/items/getters'

import { type ItemPayload } from '@renderer/types/items'

const { getAllItems, addItem, removeAllItems, removeSelectedItems, changeItem } = window.events

export const useItemsStore = defineStore('items', {
  state: itemsState(),
  getters: { ...itemsGetters() },
  actions: {
    async initItemsStore() {
      const { items } = await getAllItems()

      this.items = items
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
      await addItem(item)
    },
    async handleSelectItem(id: ItemPayload['id']) {
      this.items.find((item: ItemPayload) => {
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
    async setFormPayload(id: number) {
      this.items.find((item: ItemPayload) => {
        if (item.id === id) {
          this.formPayload = { ...item, fromChange: true }
        }
      })
    },
    async handleChangeItem(itemDetails: ItemPayload) {
      await changeItem(itemDetails)
      await this.initItemsStore()
    }
  }
})
