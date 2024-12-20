<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'

import ElectronIcon from '@renderer/components/ElectronIcon.vue'
import { useAppDataStore } from '@renderer/store/appData'

import NodeIcon from './NodeIcon.vue'

const appDataStore = useAppDataStore()

const versions = reactive({ ...window.electron.process.versions })
const { application } = reactive({ ...window.versions })
const appVersion = ref<string>('')
const showUpdateModal = ref<boolean>(false)

const updateAvailableText = computed(() => {
  console.log(appDataStore.getUpdateAvailability)
  return appDataStore.getUpdateAvailability
    ? 'Aggiornamento disponibile'
    : 'Nessun aggiornamento disponibile'
})

const fetchAppVersion = async () => {
  try {
    // Aspetta la risoluzione della Promise
    appVersion.value = await application()
  } catch (error) {
    console.error('Errore nel recupero della versione:', error)
  }
}

const handleUpdateClick = () => {
  appDataStore.setUpdateHandler('installUpdate')
}

const handleUpdateModal = () => {
  if (!appDataStore.getUpdateAvailability) return

  showUpdateModal.value = !showUpdateModal.value
}

onMounted(fetchAppVersion)
</script>

<template>
  <div class="versions">
    <h2 class="versions__heading">Info App</h2>
    <ul class="versions__list">
      <li class="versions__list__app-version">
        <img src="../assets/style/icons/icon.png" alt="My Warehouse Logo" />
        <h3>Versione App</h3>
        <p>My Warehouse v{{ appVersion }}</p>
        <span @click="handleUpdateModal">
          <p
            :class="[
              'versions__list__app-version__update-cta',
              {
                'versions__list__app-version__update-cta--active':
                  appDataStore.getUpdateAvailability
              }
            ]"
          >
            {{ updateAvailableText }}
          </p>
        </span>
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
  <div v-if="showUpdateModal" class="modal" v-click-outside="handleUpdateModal">
    <div class="modal__content">
      <h2>Aggiornamento disponibile</h2>
      <p>È disponibile un aggiornamento per l'applicazione.</p>
      <p>Procedendo con l'installazione, l'applicazione verra riavviata</p>
      <button @click="handleUpdateClick">Installa</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use 'sass:color';

$gray-color: #2f3241c0;

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
  background-color: color.adjust($gray-color, $lightness: 10%);
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
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 200px;
      gap: 14px;

      & img {
        width: 50%;
        background-color: #c2f5ff;
        padding: 10px;
        border-radius: 16px;
      }

      &__update-cta {
        font-size: 12px;
        padding: 12px 16px;
        border: 1px solid #c2f5ff;
        border-radius: 16px;

        &--active {
          cursor: pointer;

          &:hover {
            transition: all ease-in-out 0.4s;
            background-color: #c2f5ff;
            color: #2f3241;
          }
        }
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

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;

  &__content {
    display: flex;
    flex-direction: column;
    gap: 20px;
    background-color: #2f3241;
    padding: 20px;
    border-radius: 16px;
    color: #c2f5ff;
    text-align: center;

    & button {
      padding: 10px 20px;
      border-radius: 16px;
      background-color: #c2f5ff;
      color: #2f3241;
      cursor: pointer;
      transition: all ease-in-out 0.4s;

      &:hover {
        background-color: #2f3241;
        color: #c2f5ff;
      }
    }
  }
}
</style>
<!-- #c2f5ff -->
