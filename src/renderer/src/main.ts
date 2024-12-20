import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import { createPinia } from 'pinia'

import App from './App.vue'

import quagga from './plugins/quagga'

import vClickOutside from './composables/v-click-outside'

import { loadLayoutMiddleware } from '@renderer/middleware/loadLayoutMiddleware'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'

const routes = [
  {
    path: '/',
    component: () => import('@views/index.vue'),
    meta: {
      layout: 'Default'
    }
  },
  {
    path: '/newProduct',
    component: () => import('@views/NewProduct.vue'),
    meta: {
      layout: ''
    }
  },
  {
    path: '/WebCamModal',
    component: () => import('@views/WebCamModal.vue'),
    meta: {
      layout: ''
    }
  },
  {
    path: '/settings',
    component: () => import('@views/Settings.vue'),
    meta: {
      layout: 'Default'
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

const pinia = createPinia()
const app = createApp(App)

library.add(fas, far, fab)

router.beforeEach(loadLayoutMiddleware)

app.component('FontAwesomeIcon', FontAwesomeIcon)

app.use(pinia).use(router).use(quagga)

app.directive('click-outside', vClickOutside)

app.mount('#app')
