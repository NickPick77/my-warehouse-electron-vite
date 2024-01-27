<script setup lang="ts">
import GridHeading from '@components/GridHeading.vue'
import ItemRow from '@components/ItemRow.vue'

import { useItemsStore } from '@renderer/store/items/index'

const itemsStore = useItemsStore()
</script>

<template>
  <div class="grid">
    <GridHeading class="grid__heading" />
    <div v-for="item in itemsStore.getItems" :key="item.id" class="grid__item">
      <ItemRow :item-data="item" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@renderer/assets/style/main.scss' as *;

.grid {
  @include windowContainerBoxShadow;

  min-height: 50vh;
  margin: 0 20px 40px;
  padding: 20px;
  border: 1px solid rgba(0, 0, 0, 0.01);
  border-radius: 16px;
  background-color: white;

  &__heading {
    padding: 5px;
    margin-bottom: 8px;
  }

  &__item {
    @include windowContainerBoxShadow;

    padding: 5px;
    border: 1px solid rgba(0, 0, 0, 0.01);
    border-radius: 16px;
    margin-bottom: 8px;
    transition: background-color 0.4s cubic-bezier(0.8, 0.4, 0.3, 1.25);
    cursor: pointer;

    &:hover {
      background-color: rgba(22, 126, 222, 0.3);
    }
  }
}
</style>
