<script setup lang="ts">
import NewProductForm from '@components/NewProductForm.vue'
import { useItemsStore } from '@renderer/store/items/index'
import { ProductFormPayload } from '@renderer/types/items'

const itemsStore = useItemsStore()

const { closeProductWindow } = window.events

const handleOnCloseAddProduct = async () => {
  await closeProductWindow()
}

const handleOnSaveItem = async ($event: ProductFormPayload) => {
  if ($event.type === 'save' && !$event.formPayload.fromChange) {
    const suitablePayload = {
      ...$event.formPayload,
      isSelected: false
    }

    delete suitablePayload.fromChange

    itemsStore.handleAddItem(suitablePayload)

    await handleOnCloseAddProduct()
  } else {
    itemsStore.handleChangeItem($event.formPayload)

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

<style lang="scss" scoped></style>
