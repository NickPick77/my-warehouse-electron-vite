<script setup lang="ts">
import { reactive } from 'vue'

const versions = reactive({ ...window.electron.process.versions })

const { application } = window.versions
</script>

<template>
  <ul class="versions">
    <li class="electron-version">Electron v{{ versions.electron }}</li>
    <li class="chrome-version">Chromium v{{ versions.chrome }}</li>
    <li class="node-version">Node v{{ versions.node }}</li>
    <li class="v8-version">V8 v{{ versions.v8 }}</li>
    <li class="v8-version">My Warehouse v{{ application() }}</li>
  </ul>
</template>

<style lang="scss" scoped>
ul {
  background-color: #2f3241;
}
</style>
