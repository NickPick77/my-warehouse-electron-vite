<script setup lang="ts">
import { computed, ref } from 'vue'

import CheckBoxToggle from '@components/CheckBoxToggle.vue'
import RoundIconButton from '@components/RoundIconButton.vue'

import { useItemsStore } from '@renderer/store/items/index'

import { type ItemPayload } from '@renderer/types/items'

interface Props {
  itemData: ItemPayload
}

const itemsStore = useItemsStore()

const { itemData } = defineProps<Props>()

const emit = defineEmits(['handleAllItemSelected'])

const isHovered = ref<boolean>(false)

const setStatusWithQuantity = computed(() => {
  const statusSpanDefaultClass = 'item-row-container__quantity__status'
  if (Number(itemData.quantity) <= 3) {
    return [statusSpanDefaultClass, `${statusSpanDefaultClass}--warning`]
  }

  if (Number(itemData.quantity) <= 5) {
    return [statusSpanDefaultClass, `${statusSpanDefaultClass}--alert`]
  }

  return [statusSpanDefaultClass]
})

const handleSelectItem = (id: number) => {
  if (!id) {
    emit('handleAllItemSelected')
    return
  }

  itemsStore.handleSelectItem(id)
}
</script>

<template>
  <div class="item-row-container">
    <CheckBoxToggle
      :is-selected="itemData.isSelected"
      @handle-check="handleSelectItem(Number(itemData.id))"
    />
    <!-- <div v-if="itemData.img_url">
      <img :src="itemData.img_url" />
    </div>
    <div v-else>{{ itemData.img_title }}</div> -->
    <div>{{ itemData.item_name }}</div>
    <div class="item-row-container__quantity">
      <span
        v-if="Number(itemData.quantity) || itemData.quantity === 0"
        :class="setStatusWithQuantity"
      />
      {{ itemData.quantity }}
    </div>
    <div v-if="itemData.bar_code">{{ itemData.bar_code }}</div>
    <div v-else>{{ itemData.bar_code_title }}</div>
    <RoundIconButton
      v-if="itemData.bar_code"
      class="item-row-container__utils-btn__change-icon"
      @mouseover="isHovered = true"
      @mouseleave="isHovered = false"
    >
      <font-awesome-icon icon="fa-solid fa-wrench" class="utils-btn__wrapper__icon" />
    </RoundIconButton>
  </div>
</template>

<style lang="scss" scoped>
@use '@renderer/assets/style/main.scss' as *;

.item-row-container {
  display: grid;
  grid-template-columns: auto repeat(3, 1fr) 5%;
  grid-template-rows: 50px;
  align-items: center;

  &__quantity,
  div {
    display: flex;
    justify-content: center;
    align-items: center;

    &__status {
      @include roundButtonBoxShadow;

      border-radius: 25px;
      padding: 6px;
      margin-right: 4px;
      margin-bottom: 2px;
      background-color: var(--mw-success);

      &--alert {
        background-color: var(--mw-alert);
      }

      &--warning {
        background-color: var(--mw-error);
      }
    }
  }

  & img {
    width: 50%;
    height: 100%;
    object-fit: cover;
    margin: 0 auto;
  }

  &__utils-btn {
    &__change-icon {
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
