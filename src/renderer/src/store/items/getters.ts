import { GetterTree } from "pinia";
import type { ItemsStateType } from "./state";
import type { ItemPayload } from "../types/items";

// Definizione del tipo dell'oggetto ItemType
export interface ItemType {
  // ... definizione dei campi dell'oggetto
  isSelected: boolean;
}

// Definizione del tipo per i getter
export interface ItemsGetters {
  getItems(state: ItemsState): ItemType[];
  getAllItemSelected(state: ItemsState): boolean;
  getAllSelectedItems(state: ItemsState): ItemType[];
}

export const itemsGetters: GetterTree<
  ItemsStateType,
  ItemsStateType,
  ItemsGetters
> = () => ({
  getItems: (state: ItemsStateType) => state.items,
  getAllItemSelected: (state: ItemsStateType) => state.allItemSelected,
  getAllSelectedItems: (state: ItemsStateType) =>
    state.items.filter((item: ItemPayload) => item.isSelected),
});
