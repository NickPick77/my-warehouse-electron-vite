<script setup lang="ts">
import { useItemsStore } from "../store/items/index";

const itemsStore = useItemsStore();
</script>

<template>
  <div class="grid">
    <GridHeading class="grid__heading" />
    <div v-for="item in itemsStore.getItems" class="grid__item">
      <ItemRow :item-data="item" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.grid {
  @include windowContainerBoxShadow;

  display: grid;
  align-items: center;
  align-content: center;
  gap: 5px;
  margin: 0 20px 40px;
  padding: 20px;
  border: 1px solid rgba(0, 0, 0, 0.01);
  border-radius: 16px;

  &__heading {
    padding: 5px;
  }

  &__item {
    @include windowContainerBoxShadow;

    padding: 5px;
    border: 1px solid rgba(0, 0, 0, 0.01);
    border-radius: 16px;
    transition: background-color 0.4s cubic-bezier(0.8, 0.4, 0.3, 1.25);
    cursor: pointer;

    &:hover {
      background-color: rgba(22, 126, 222, 0.3);
    }
  }
}
</style>
