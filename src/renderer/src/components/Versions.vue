<script setup lang="ts">
import { reactive } from 'vue'
import ElectronIcon from '@renderer/components/ElectronIcon.vue'
import NodeIcon from './NodeIcon.vue'

const versions = reactive({ ...window.electron.process.versions })

const { application } = reactive({ ...window.versions })
</script>

<template>
  <div class="versions">
    <h2 class="versions__heading">Info App</h2>
    <ul class="versions__list">
      <li class="versions__list__app-version">
        <img src="../assets/style/icons/icon.png" alt="My Warehouse Logo" />
        <strong>Versione App</strong> My Warehouse v{{ application() }}
      </li>
      <div class="versions__list__wrapper">
        <li class="versions__list__wrapper__electron-version">
          <ElectronIcon />
          <strong>Versione Electron</strong> Electron v{{ versions.electron }}
        </li>
        <li class="versions__list__wrapper__chrome-version">
          <img src="../assets/style/icons/google_chrome_icon.png" alt="My Warehouse Logo" />
          <strong>Versione Chromium</strong> Chromium v{{ versions.chrome }}
        </li>
      </div>
      <li class="node-version">
        <NodeIcon />
        <strong>Versione Node</strong> Node v{{ versions.node }}
      </li>
      <li class="versions__list__v8-version">
        <strong>Versione V8 Engine</strong> V8 v{{ versions.v8 }}
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
li {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
  padding: 10px;
  font-size: 13px;
  line-height: 16px;
  border-radius: 16px;
  opacity: 0.8;
  background-color: lighten(#2f3241c0, 10%);
  flex: 1 0 auto;
}

img {
  width: 20%;
}
.versions {
  font-family: 'Menlo', 'Lucida Console', monospace;
  color: #c2f5ff;
  line-height: 1;
  transition: all 0.3s;
  width: 60%;

  &__heading {
    margin: 0 11px;
    padding: 10px 0;
  }

  &__list {
    display: flex;
    flex-wrap: wrap;
    border: 1px solid rgba(194, 245, 255, 0.4);
    border-radius: 16px;
    gap: 12px;
    margin: 0 10px;
    padding: 15px;

    &__app-version {
      width: 200px;
      gap: 20px;

      & img {
        width: 50%;
        background-color: #c2f5ff;
        padding: 10px;
        border-radius: 16px;
      }
    }

    &__wrapper {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 10px;
      width: 48%;
    }
  }
}
</style>
<!-- #c2f5ff -->
