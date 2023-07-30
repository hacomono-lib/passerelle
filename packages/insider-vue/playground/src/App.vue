<script setup lang="ts">
import { ref } from 'vue'
import { RouterView, onBeforeRouteUpdate } from 'vue-router'
import { onUpdateLayout } from '@passerelle/insider-vue';

import Header from './components/Header.vue'
import Log, { type Log as LogUnit } from './components/Log.vue'

onUpdateLayout((layout) => {
  console.log('test')
  addLog({
    event: 'layout',
    key: 'layout',
    value: layout
  })
})

const logs = ref<LogUnit[]>([])

function addLog(log: Omit<LogUnit, 'time'>) {
  logs.value = [
    ...logs.value,
    {
      time: new Date().toLocaleTimeString(),
      ...log
    }
  ]
}
</script>

<template>
  <section>
    <Header >
      <RouterView />
    </Header>
    <Log :logs="logs" />
  </section>
</template>

<style scoped>
section {
  line-height: 1.5;
  height: 95vh;
}
</style>
