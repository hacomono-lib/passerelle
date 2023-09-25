# @passerelle/enclosure-vue

## usage

### setup

```ts
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)
app.use(insider, { router })

app.mount('#app')
```

## Api

### onUpdateLayout

```vue
<script setup>
import { onUpdateLayout } from '@passerelle/insider-vue'

onUpdateLayout((layout) => {
  // do something on parent iframe layout change
})
</script>
```

### inject

```vue
<script>
import { defineComponent } from 'vue'
import { INJECT_KEY } from '@passerelle/insider-vue'

export default defineComponent({
  inject: [INJECT_KEY],
  
})
</script>
