import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { insider } from '@passerelle/insider-vue'

const app = createApp(App)

app.use(router)
app.use(insider, { router })


app.mount('#app')
