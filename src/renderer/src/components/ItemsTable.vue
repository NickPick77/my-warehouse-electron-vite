<script setup lang="ts">
import { computed } from 'vue'
import CheckBoxToggle from '@components/CheckBoxToggle.vue'
import RoundIconButton from '@components/RoundIconButton.vue'

import { useItemsStore } from '@renderer/store/items/index'
import { useFiltersStore } from '@renderer/store/filters/index'

const { openProductWindow } = window.events

const itemsStore = useItemsStore()
const filtersStore = useFiltersStore()

const suitableItems = computed(() => {
  if (itemsStore.getFilteredItems.length || filtersStore.getSearchQuery.length >= 3) {
    return itemsStore.getFilteredItems
  }

  return itemsStore.getItems
})

const headers = computed(() => {
  const translations = {
    isSelected: itemsStore.getAllItemSelected,
    bar_code: 'Codice a Barre',
    item_name: 'Nome Articolo',
    quantity: 'Quantità',
    purchase_price: "Prezzo d'Acquisto",
    selling_price: 'Prezzo di Vendita',
    serial_number: 'Numero di Serie',
    caliber: 'Calibro'
  }

  return Object.keys(suitableItems.value[0])
    .filter((key) => key !== 'id')
    .map(
      (key) =>
        translations[key] // Usa la traduzione se esiste
          ? translations[key]
          : key
              .replace(/_/g, ' ') // Sostituisce gli underscore con spazi
              .replace(/\b\w/g, (char) => char.toUpperCase()) // Prima lettera maiuscola
    )
})

const keys = computed(() => Object.keys(suitableItems.value[0]).filter((key) => key !== 'id'))

const handleSelectItem = async (id?: number) => {
  if (!id) {
    itemsStore.handleSelectAllItems()
    return
  }

  await itemsStore.handleSelectItem(id)
}

const handleChangeItem = async (id: number) => {
  await openProductWindow(id)
}
</script>

<template>
  <div class="grid-table" :style="{ 'grid-template-columns': `repeat(${keys.length + 1}, auto)` }">
    <div
      v-for="(header, index) in headers"
      :key="'header-' + index"
      class="grid-table__cell grid-table__header-cell"
    >
      <template v-if="keys[index] === 'isSelected'">
        <CheckBoxToggle
          :is-selected="itemsStore.getAllItemSelected"
          @handle-check="handleSelectItem()"
        />
      </template>
      <template v-else>
        {{ header }}
      </template>
    </div>

    <div class="grid-table__cell grid-table__header-cell" />

    <template v-for="(item, rowIndex) in suitableItems">
      <div
        v-for="(key, colIndex) in keys"
        :key="'cell-' + rowIndex + '-' + colIndex"
        class="grid-table__cell"
      >
        <template v-if="key === 'isSelected'">
          <CheckBoxToggle
            :is-selected="item.isSelected"
            @handle-check="handleSelectItem(Number(item.id))"
          />
        </template>
        <template v-else>
          {{ item[key] }}
        </template>
      </div>

      <div class="grid-table__cell">
        <RoundIconButton
          class="grid-table__cell grid-table__cell__utils-btn"
          @handle-click="handleChangeItem(Number(item.id))"
        >
          <font-awesome-icon icon="fa-solid fa-wrench" class="utils-btn__wrapper__icon" />
        </RoundIconButton>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
@use '@renderer/assets/style/main.scss' as *;

.grid-table {
  display: grid;
  align-items: end;

  &__header-cell {
    font-weight: bold;
    padding: 8px;
    border-bottom: 1px solid #ccc;
  }

  &__cell {
    padding: 8px;
    border-bottom: 1px solid #ccc;

    &__utils-btn {
      &:hover {
        & > svg {
          transform: scale(1.2);
          transition: transform 0.5s ease-in-out;
        }
      }
    }

    &:not(.grid-table__header-cell) {
      margin-top: 12px;
    }
  }
}
</style>
