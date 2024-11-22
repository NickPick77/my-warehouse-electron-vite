<script setup lang="ts">
import { ref, watch } from 'vue'

import RoundCrossButton from '@components/RoundCrossButton.vue'
import RoundIconButton from '@components/RoundIconButton.vue'
import GridContainer from '@components/GridContainer.vue'

import type { ItemPayload } from '@renderer/types/items'
import { useItemsStore } from '@renderer/store/items'
import { useFiltersStore } from '@renderer/store/filters'

const itemsStore = useItemsStore()
const filtersStore = useFiltersStore()

const { openProductWindow } = window.events

const isHovered = ref<boolean>(false)
const isSearchInputOpen = ref<boolean>(false)
const searchQuery = ref<string>('')
const searchDebounceTimer = ref<NodeJS.Timeout>(setTimeout(() => {}, 0))

watch(searchQuery, async (newSearchValue) => {
  clearTimeout(searchDebounceTimer.value)

  if (newSearchValue.length >= 3) {
    searchDebounceTimer.value = setTimeout(async () => {
      await filtersStore.setSearchQuery(newSearchValue)
      await itemsStore.handleSearchItems()
    }, 500)
  } else {
    await itemsStore.clearFilteredItems()
    await filtersStore.setSearchQuery('')
  }
})

const handleOpenAddItemWindow = async () => {
  await openProductWindow()
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

const handleSearchinput = async () => {
  isSearchInputOpen.value = !isSearchInputOpen.value
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
        <div class="utils-btn__wrapper__search-wrapper">
          <input
            id="search"
            v-model="searchQuery"
            :class="[
              'utils-btn__wrapper__search-wrapper__search-input',
              { 'utils-btn__wrapper__search-wrapper__search-input--open': isSearchInputOpen }
            ]"
            type="text"
            name="search"
          />
          <RoundIconButton
            class="utils-btn__wrapper__search-wrapper__icon"
            @handle-click="handleSearchinput"
          >
            <font-awesome-icon icon="fa-solid fa-magnifying-glass" />
          </RoundIconButton>
        </div>
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

    &__search-wrapper {
      position: relative;
      flex: 1 0 auto;
      &__search-input {
        width: 20px;
        margin-top: 1px;
        line-height: 20px;
        border-radius: 16px;
        border: 1px solid rgba(0, 0, 0, 0.01);
        box-shadow:
          rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
          rgba(60, 64, 67, 0.15) 0px -1px 2px 0px;
        opacity: 0;
        transition:
          width 0.5s ease-in-out,
          opacity 0.5s ease-in-out,
          padding 0.5s ease-in-out;

        &--open {
          width: 120px;
          opacity: 1;
          padding-left: 8px;

          &:focus {
            outline: 1px dashed rgba(22, 126, 222, 0.7);
            outline-offset: 0.2em;
          }
        }
      }

      &__icon {
        position: absolute;
        top: 0;
        right: 0;

        &:hover {
          & > svg {
            transform: scale(1.2);
            transition: transform 0.5s ease-in-out;
          }
        }
      }
    }
  }
}
</style>
