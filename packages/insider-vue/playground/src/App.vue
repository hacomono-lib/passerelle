<script setup lang="ts">
import { RouterView } from 'vue-router'
import Header from './components/Header.vue'
import Log from './components/Log.vue'
</script>

<template>
  <section>
    <Header >
      <RouterView />
    </Header>
    <Log />
  </section>
</template>

<style scoped>
section {
  line-height: 1.5;
  height: 95vh;
}
</style>
