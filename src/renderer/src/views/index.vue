<script setup lang="ts">
import { ref, watch } from 'vue'

import RoundCrossButton from '@components/RoundCrossButton.vue'
import RoundIconButton from '@components/RoundIconButton.vue'
import GridContainer from '@components/GridContainer.vue'

import type { ItemPayload } from '@renderer/types/items'
import { useItemsStore } from '@renderer/store/items'

const itemsStore = useItemsStore()

const { newProductWindow } = window.events

const isHovered = ref<boolean>(false)
const searchQuery = ref<string>('')
const searchDebounceTimer = ref<NodeJS.Timeout>(setTimeout(() => {}, 0))

watch(searchQuery, (newSearchValue) => {
  clearTimeout(searchDebounceTimer.value)

  if (newSearchValue.length >= 3) {
    searchDebounceTimer.value = setTimeout(() => {
      console.log(newSearchValue)
      itemsStore.handleSearchItems(newSearchValue)
    }, 500)
  } else {
    itemsStore.clearFilteredItems()
  }
})

const handleOpenAddItemWindow = async () => {
  await newProductWindow()
}

const handleRemoveSelectedItems = async () => {
  if (itemsStore.allItemSelected) {
    await handleRemoveAllItems()
    return
  }

  const itemsIdsToRemove = itemsStore.getAllSelectedItems.map((item: ItemPayload) => item.id)

  if (!itemsIdsToRemove.length) return

  await itemsStore.clearSelectedItems(itemsIdsToRemove)
}

const handleRemoveAllItems = async () => {
  await itemsStore.clearAllItems()
}
</script>

<template>
  <section>
    <div class="utils-btn">
      <div class="utils-btn__wrapper">
        <RoundCrossButton theme="add" @handle-click="handleOpenAddItemWindow" />
        <RoundIconButton
          theme="error"
          @handle-click="handleRemoveSelectedItems"
          @mouseover="isHovered = true"
          @mouseleave="isHovered = false"
        >
          <font-awesome-icon
            :class="[isHovered ? 'fa-beat' : '', 'fa-fw', 'fa-sm']"
            icon="fa-solid fa-trash"
          />
        </RoundIconButton>
        <RoundIconButton class="utils-btn__wrapper__icon" @handle-click="handleRemoveSelectedItems">
          <font-awesome-icon icon="fa-solid fa-magnifying-glass" />
        </RoundIconButton>
        <input id="search" v-model="searchQuery" type="text" name="search" />
      </div>
    </div>
    <GridContainer />
  </section>
</template>

<style lang="scss" scoped>
@use '@renderer/assets/style/main.scss' as *;

.utils-btn {
  display: flex;
  justify-content: flex-end;
  margin: 20px 20px 5px;
  &__wrapper {
    @include windowContainerBoxShadow;

    display: flex;
    gap: 4px;
    padding: 1% 2%;
    border-radius: 16px;
    background-color: white;

    &__icon {
      &:hover {
        & > svg {
          transform: scale(1.2);
          transition: transform 0.5s ease-in-out;
        }
      }
    }
  }
}
</style>
