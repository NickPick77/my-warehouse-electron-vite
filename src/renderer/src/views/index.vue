<script setup lang="ts">
import type { ItemPayload } from "../types/items";
import { useItemsStore } from "../store/items/index";

const itemsStore = useItemsStore();

const { newProductWindow } = window.events;

const handleOpenAddItemWindow = async () => {
  await newProductWindow();
};

const handleRemoveSelectedItems = async () => {
  if (itemsStore.allItemSelected) {
    await handleRemoveAllItems();
    return;
  }

  const itemsIdsToRemove = itemsStore.getAllSelectedItems.map(
    (item: ItemPayload) => item.id
  );

  if (!itemsIdsToRemove.length) return;

  await itemsStore.clearSelectedItems(itemsIdsToRemove);
};

const handleRemoveAllItems = async () => {
  await itemsStore.clearAllItems();
};
</script>

<template>
  <main>
    <NavBar />
    <div class="utils-btn">
      <RoundCrossButton theme="add" @handle-click="handleOpenAddItemWindow" />
      <DeleteIcon @handle-click="handleRemoveSelectedItems" />
    </div>
    <GridContainer />
  </main>
</template>

<style lang="scss" scoped>
.utils-btn {
  display: flex;
  justify-content: flex-end;
  gap: 4px;
  margin: 20px 20px 5px;
}
</style>
