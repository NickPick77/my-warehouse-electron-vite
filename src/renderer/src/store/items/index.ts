import { defineStore } from "pinia";
import { itemsState } from "./state";
import { itemsGetters } from "./getters";

import { type ItemPayload } from "../../types/items";

const {
  getAllItems,
  addItem,
  removeItem,
  removeAllItems,
  removeSelectedItems,
} = window.events;

export const useItemsStore = defineStore("items", {
  state: itemsState(),
  getters: itemsGetters(),
  actions: {
    async initItemsStore() {
      const { items } = await getAllItems();

      this.items = items;
    },
    async clearAllItems() {
      this.items = [];
      this.allItemSelected = false;
      await removeAllItems();
    },
    async clearSelectedItems(ids) {
      this.items = this.items.filter((item) => !ids.includes(item.id));
      await removeSelectedItems(ids);
    },
    async handleAddItem(item) {
      this.items.push(item);
      await addItem(item);
    },
    async handleRemoveItem(id: ItemPayload["id"]) {
      this.items = this.items.filter((item) => item.id !== id);
      await removeItem(id);
    },
    async handleSelectItem(id: ItemPayload["id"]) {
      this.items.find((item: ItemPayload) => {
        if (item.id === id) {
          item.isSelected = !item.isSelected;
        }
      });
    },
    async handleSelectAllItems() {
      this.items.forEach((item) => {
        if (this.allItemSelected) {
          item.isSelected = false;
          return;
        }

        if (!this.allItemSelected) {
          item.isSelected = true;
          return;
        }
      });

      this.allItemSelected = !this.allItemSelected;
    },
  },
});
