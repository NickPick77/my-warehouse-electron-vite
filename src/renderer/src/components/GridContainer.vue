<script setup lang="ts">
import { computed } from 'vue'
import ItemsTable from '@components/ItemsTable.vue'

import { useItemsStore } from '@renderer/store/items/index'
import { useFiltersStore } from '@renderer/store/filters/index'

const itemsStore = useItemsStore()
const filtersStore = useFiltersStore()

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
    <div v-if="emptyResults === 'no-filtered'" class="empty-results__no-items">
      <h2>Nessun Risultato!</h2>
    </div>
    <div v-else-if="emptyResults === 'no-items'" class="empty-results__no-items">
      <h2>Nessun Prodotto Aggiunto!</h2>
      <p>Clicca sul pulsante verde in alto a destra per iniziare ad aggiungere i tuoi prodotti</p>
    </div>
    <ItemsTable v-else />
  </div>
</template>

<style lang="scss" scoped>
@use '@renderer/assets/style/main.scss' as *;

.grid {
  width: 100%;
  min-height: 70vh;
  padding: 20px;
  border-top-right-radius: 16px;
  border-bottom-right-radius: 16px;
  background-color: white;
  box-shadow: rgba(60, 64, 67, 0.3) 20px 1px 2px 0px,
  rgba(60, 64, 67, 0.15) 20px 2px 6px 2px;
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
