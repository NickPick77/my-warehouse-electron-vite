<script setup lang="ts">
import { computed } from 'vue'
import ItemRow from './ItemRow.vue'
import { useItemsStore } from '../store/items/index'

const itemsStore = useItemsStore()

const headingData = computed(() => ({
  isSelected: itemsStore.getAllItemSelected,
  item_name: 'Prodotto',
  quantity: 'Quantità',
  img_title: 'Immagine',
  bar_code_title: 'Codice A Barre'
}))

const handleSelectAllItems = () => {
  itemsStore.handleSelectAllItems()
}
</script>

<template>
  <div>
    <ItemRow :item-data="headingData" @handle-all-item-selected="handleSelectAllItems" />
  </div>
</template>
