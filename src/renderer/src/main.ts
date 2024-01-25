import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import { createPinia } from 'pinia'

import App from './App.vue'
import Home from './views/index.vue'
import NewProduct from './views/NewProduct.vue'
import WebCamModal from './views/WebCamModal.vue'

import quagga from './plugins/quagga'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'

// 2. Define some routes
// Each route should map to a component.
// We'll talk about nested routes later.
const routes = [
  { path: '/', component: Home },
  { path: '/newProduct', component: NewProduct },
  { path: '/WebCamModal', component: WebCamModal }
]

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
const router = createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: createWebHashHistory(),
  routes // short for `routes: routes`
})
const pinia = createPinia()
const app = createApp(App)

library.add(fas, far, fab)

app.component('Home', Home).component('FontAwesomeIcon', FontAwesomeIcon)

app.use(pinia)
app.use(router)
app.use(quagga)

app.mount('#app')
