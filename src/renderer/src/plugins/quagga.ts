import Quagga from 'quagga'
import { type App } from 'vue'

export default {
  install: (app: App) => {
    app.provide('Quagga', Quagga)
  }
}
