<script setup lang="ts">
import { onMounted } from 'vue'

import { useItemsStore } from './store/items'
import { IpcRendererEvent } from 'electron'

const itemsStore = useItemsStore()

const { addItemSuccess, itemToChangeFinded, changeItemSuccess } = window.events

onMounted(async () => {
  try {
    await itemsStore.initItemsStore()
  } catch (error) {
    console.log(error)
  }

  addItemSuccess(async () => {
    await itemsStore.initItemsStore()
  })

  itemToChangeFinded(async (_: IpcRendererEvent, id: number) => {
    await itemsStore.setFormPayload(Number(id))
  })

  changeItemSuccess(async () => {
    await itemsStore.initItemsStore()
  })
})
</script>

<template>
  <component :is="$route.meta.layoutComponent" />
  <main>
    <router-view></router-view>
  </main>
</template>

<style lang="scss">
@use 'assets/style/main.scss' as *;

@import '@fortawesome/fontawesome-svg-core/styles.css';

@import 'assets/css/styles.css';

html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
  background-color: #2f3241;
}

#app {
  height: 100%;
}
</style>
