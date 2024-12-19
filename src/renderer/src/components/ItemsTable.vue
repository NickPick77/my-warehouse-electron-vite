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
  <div class="grid-table">
    <div
      class="grid-table__row grid-table__row--header"
      :style="{ 'grid-template-columns': `repeat(${keys.length + 1}, minmax(100px, 1fr))` }"
    >
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
      <!-- Cella vuota per la colonna del bottone "Modifica" -->
      <div class="grid-table__cell grid-table__header-cell"></div>
    </div>

    <template v-for="(item, rowIndex) in suitableItems" :key="'row-' + rowIndex">
      <div
        class="grid-table__row"
        :class="{ 'grid-table__row--active': item.isSelected }"
        :style="{ 'grid-template-columns': `repeat(${keys.length + 1}, minmax(100px, 1fr))` }"
      >
        <div
          v-for="(key, colIndex) in keys"
          :key="'cell-' + rowIndex + '-' + colIndex"
          :class="[
            'grid-table__cell',
            {
              'grid-table__cell--quantity': key === 'quantity'
            }
          ]"
        >
          <template v-if="key === 'isSelected'">
            <CheckBoxToggle
              :is-selected="item.isSelected"
              @handle-check="handleSelectItem(Number(item.id))"
            />
          </template>
          <template v-else-if="['purchase_price', 'selling_price'].includes(key)">
            {{ item[key] }} €
          </template>
          <template v-else-if="key === 'quantity'">
            <div
              :class="[
                'grid-table__cell__quantity',
                {
                  'grid-table__cell__quantity--warning': Number(item[key]) <= 5,
                  'grid-table__cell__quantity--danger': Number(item[key]) === 0,
                  'grid-table__cell__quantity--success': Number(item[key]) > 5
                }
              ]"
            ></div>
            <span>
              {{ item[key] }}
            </span>
          </template>
          <template v-else>
            {{ item[key] }}
          </template>
        </div>
        <div class="grid-table__cell utils-btn">
          <RoundIconButton
            class="grid-table__cell__utils-btn"
            @handle-click="handleChangeItem(Number(item.id))"
          >
            <font-awesome-icon icon="fa-solid fa-wrench" class="utils-btn__wrapper__icon" />
          </RoundIconButton>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
@use '@renderer/assets/style/main.scss' as *;

.grid-table {
  display: flex;
  flex-direction: column;
  gap: 12px;

  &__row {
    display: grid;
    column-gap: 12px;
    background-color: white;
    border-bottom: 1px solid #ccc; /* Separatore orizzontale per ogni riga */
    align-items: center;

    &--header {
      font-weight: bold;
      border-bottom: 2px solid #ccc;
    }

    &--active {
      background-color: rgba(22, 126, 222, 0.3);
      transition: background-color 0.5s ease-in-out;
      border-radius: 16px;
    }
  }

  &__cell {
    padding: 8px;
    display: flex;
    align-items: center;

    &--quantity {
      justify-content: flex-start;
    }

    &__quantity {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      margin-right: 8px;
      margin-left: 4px;
      background-color: var(--mw-success);

      &--warning {
        background-color: var(--mw-alert);
      }

      &--danger {
        background-color: var(--mw-error);
      }

      &--success {
        background-color: var(--mw-success);
      }
    }

    &__utils-btn {
      width: 48px;
      height: 48px;
      cursor: pointer;

      &:hover {
        & > svg {
          transform: scale(1.2);
          transition: transform 0.5s ease-in-out;
        }
      }
    }
  }

  .utils-btn {
    justify-content: center;
  }
}
</style>
