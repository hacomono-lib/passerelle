import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import plugin from '@passerelle/enclosure-vue'

const app = createApp(App)

app.use(router)
app.use(plugin(router), { path: '/bridge' })

app.mount('#app')
