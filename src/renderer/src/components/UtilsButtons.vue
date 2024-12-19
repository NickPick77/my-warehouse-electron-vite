<script setup lang="ts">
import { ref, watch } from 'vue'

import RoundIconButton from '@components/RoundIconButton.vue'

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

  await itemsStore.clearSelectedItems(itemsIdsToRemove as number[])
}

const handleRemoveAllItems = async () => {
  await itemsStore.clearAllItems()
}

const handleSearchinput = async () => {
  isSearchInputOpen.value = !isSearchInputOpen.value
}
</script>

<template>
  <div class="utils-btn">
    <div class="utils-btn__wrapper">
      <RoundIconButton
        class="utils-btn__wrapper__btn"
        theme="success"
        @handle-click="handleOpenAddItemWindow"
      >
        <font-awesome-icon class="utils-btn__wrapper__btn_cross-icon" icon="fa-solid fa-plus" />
      </RoundIconButton>
      <RoundIconButton
        class="utils-btn__wrapper__btn"
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
      <div
        :class="[
          'utils-btn__wrapper__search-wrapper',
          {
            'utils-btn__wrapper__search-wrapper--open': isSearchInputOpen
          }
        ]"
      >
        <RoundIconButton
          class="utils-btn__wrapper__search-wrapper__icon"
          @handle-click="handleSearchinput"
        >
          <font-awesome-icon icon="fa-solid fa-magnifying-glass" />
        </RoundIconButton>
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
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@renderer/assets/style/main.scss' as *;

.utils-btn {
  display: flex;
  justify-content: flex-end;
  margin: 20px 20px 0;
  &__wrapper {
    @include windowContainerBoxShadow;

    display: flex;
    padding: 1% 2%;
    gap: 12px;
    border-radius: 16px;
    background-color: white;

    &::v-deep(button) {
      width: 48px;
      height: 48px;
    }

    &__btn_cross-icon {
      font-size: 20px;
    }

    &__search-wrapper {
      display: flex;
      justify-content: flex-end;
      position: relative;
      flex: 1 0 auto;
      width: 48px;
      margin-left: 0px;
      transition:
        width 0.5s ease-in-out,
        margin-left 0.5s ease-in-out;

      &__search-input {
        position: absolute;
        top: 0;
        right: 0;
        width: 20px;
        height: 44px;
        line-height: 20px;
        border-radius: 28px;
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
          width: 220px;
          opacity: 1;
          padding-left: 12px;

          &:focus {
            outline: 1px dashed rgba(22, 126, 222, 0.7);
            outline-offset: 0.2em;
          }
        }
      }

      &--open {
        width: 220px;
        margin-left: 16px;
      }

      &__icon {
        position: relative;
        z-index: 1;

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
