<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import Header from './components/Header.vue'
import { useCommunicator } from '@passerelle/insider-vue'
import Playground from 'playground-vue-component'

onMounted(() => {
  const communicator = useCommunicator()

  ;(window as any).getCommunicator = () => communicator
})
</script>

<template>
  <section>
    <Header>
      <RouterView />
    </Header>
    <Playground mode="insider" />
  </section>
</template>

<style scoped>
section {
  line-height: 1.5;
  height: 95vh;
}
</style>
