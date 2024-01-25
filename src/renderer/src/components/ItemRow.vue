<script setup lang="ts">
import { computed } from "vue";
import { useItemsStore } from "../store/items/index";

import { type ItemPayload } from "../types/items";

interface Props {
  itemData: ItemPayload;
}

const itemsStore = useItemsStore();

const { itemData } = defineProps<Props>();

const emit = defineEmits(["handleAllItemSelected"]);

const setStatusWithQuantity = computed(() => {
  const statusSpanDefaultClass = "item-row-container__quantity__status";
  if (Number(itemData.quantity) <= 3) {
    return [statusSpanDefaultClass, `${statusSpanDefaultClass}--warning`];
  }

  if (Number(itemData.quantity) <= 5) {
    return [statusSpanDefaultClass, `${statusSpanDefaultClass}--alert`];
  }

  return [statusSpanDefaultClass];
});

const handleSelectItem = (id: number) => {
  if (!id) {
    emit("handleAllItemSelected");
    return;
  }

  itemsStore.handleSelectItem(id);
};
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
        :class="setStatusWithQuantity"
        v-if="Number(itemData.quantity) || itemData.quantity === 0"
      />
      {{ itemData.quantity }}
    </div>
    <div v-if="itemData.bar_code">{{ itemData.bar_code }}</div>
    <div v-else>{{ itemData.bar_code_title }}</div>
  </div>
</template>

<style lang="scss" scoped>
.item-row-container {
  display: grid;
  grid-template-columns: auto repeat(3, 1fr);
  grid-template-rows: 50px;

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
}
</style>
