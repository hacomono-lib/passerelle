import './assets/css/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { enclosure } from '@passerelle/enclosure-vue'

const app = createApp(App)

app.use(router)
app.use(enclosure)

app.mount('#app')
