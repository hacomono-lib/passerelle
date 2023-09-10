<script setup lang="ts">
import Playground from 'playground-vue-component'
</script>

<template>
  <section>
    <Header />
    <Playground mode="enclosure" />
  </section>

  <section>
    <slot />
  </section>
</template>

<style scoped>
section {
  line-height: 1.5;
  height: 95vh;
}
</style>
