<script setup lang="ts">
import { RouterView } from 'vue-router'
import Header from './components/Header.vue'
import Playground from 'playground-vue-component'
</script>

<template>
  <section>
    <Header />
    <Playground mode="enclosure" />
  </section>

  <section>
    <RouterView />
  </section>
</template>

<style scoped>
section {
  line-height: 1.5;
  height: 95vh;
}
</style>
