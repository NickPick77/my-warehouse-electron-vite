<script setup lang="ts">
export interface ProductFormPayload {
  type: 'save' | 'clear'
  formPayload: {
    bar_code: string
    item_name: string
    quantity: number
  }
}
import NewProductForm from '@renderer/components/NewProductForm.vue'
import { useItemsStore } from '../store/items/index'

const itemsStore = useItemsStore()

const { closeProductWindow } = window.events

const handleOnCloseAddProduct = async () => {
  await closeProductWindow()
}

const handleOnSaveItem = async ($event: ProductFormPayload) => {
  if ($event.type === 'save') {
    itemsStore.handleAddItem({
      isSelected: false,
      ...$event.formPayload
    })

    await handleOnCloseAddProduct()
  }

  if ($event.type === 'clear') {
    await handleOnCloseAddProduct()
  }
}
</script>

<template>
  <section>
    <NewProductForm
      @handle-click-on-close-window="handleOnCloseAddProduct"
      @handle-click="handleOnSaveItem($event)"
    />
  </section>
</template>

<style lang="scss" scoped>
section {
  & > div {
    height: 100vh;
  }
}
</style>
