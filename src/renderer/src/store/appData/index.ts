import { defineStore } from 'pinia'
import type { AppDataStateType } from '@renderer/store/appData/types'

const {
  updateHandler
} = window.events

export const useAppDataStore = defineStore('appData', {
  state: (): AppDataStateType => ({
    updateAvailable: false
  }),
  getters: {
    getUpdateAvailability: (state: AppDataStateType) => state.updateAvailable
  },
  actions: {
    setUpdateAvailability(toggle: boolean) {
      this.updateAvailable = toggle
    },
    setUpdateHandler(cmd: string) {
      updateHandler(cmd)
    }
  }
})