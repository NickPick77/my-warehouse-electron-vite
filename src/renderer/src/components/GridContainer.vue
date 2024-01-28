<script setup lang="ts">
import { computed } from 'vue'
import GridHeading from '@components/GridHeading.vue'
import ItemRow from '@components/ItemRow.vue'

import { useItemsStore } from '@renderer/store/items/index'
import { useFiltersStore } from '@renderer/store/filters/index'

const itemsStore = useItemsStore()
const filtersStore = useFiltersStore()

const suitableItems = computed(() => {
  if (itemsStore.getFilteredItems.length || filtersStore.getSearchQuery.length >= 3) {
    return itemsStore.getFilteredItems
  }

  return itemsStore.getItems
})

const emptyResults = computed(() => {
  if (itemsStore.getFilteredItems.length === 0 && filtersStore.getSearchQuery.length >= 3) {
    return 'no-filtered'
  }

  if (itemsStore.getItems.length === 0) {
    return 'no-items'
  }

  return ''
})
</script>

<template>
  <div class="grid">
    <GridHeading class="grid__heading" />
    <div v-for="item in suitableItems" :key="item.id" class="grid__item">
      <ItemRow :item-data="item" />
    </div>
    <div v-if="emptyResults === 'no-filtered'">Nessun Risultato!</div>
    <div v-if="emptyResults === 'no-items'" class="empty-results__no-items">
      <h2>Nessun Prodotto Aggiunto!</h2>
      <p>Clicca sul pulsante verde in alto a destra per iniziare ad aggiungere i tuoi prodotti</p>
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

.empty-results {
  &__no-items {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 50px;
    color: var(--mw-primary);
    text-shadow: 2px black;
    font-size: 18px;

    & h2 {
      text-shadow: 0px 0px 1px #0000004a;
    }

    & p {
      color: black;
      font-size: 14px;
      margin-top: 0;
    }
  }
}
</style>
<!-- #2f3241c0; -->
