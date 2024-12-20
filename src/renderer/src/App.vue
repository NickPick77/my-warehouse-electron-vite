<script setup lang="ts">
import { onMounted } from 'vue'

import { useItemsStore } from '@renderer/store/items'
import { useAppDataStore } from '@renderer/store/appData'

const itemsStore = useItemsStore()
const appDataStore = useAppDataStore()

const { addItemSuccess, changeItemSuccess, itemFinded, appUpdate } = window.ipcRendererListenerAPIs

onMounted(async () => {
  try {
    await itemsStore.initItemsStore()
  } catch (error) {
    console.log(error)
  }

  addItemSuccess(async () => {
    await itemsStore.initItemsStore()
  })

  itemFinded((_, item) => {
    itemsStore.setProductData(item)
  })

  changeItemSuccess(async () => {
    await itemsStore.initItemsStore()
  })

  appUpdate((_, updateInfo) => {
    console.log('appUpdate', updateInfo)
    if (updateInfo.isAvailable && updateInfo.status === 'downloaded') {
      console.log('updateInfo', updateInfo)
      appDataStore.setUpdateAvailability(updateInfo.isAvailable)
    }
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
