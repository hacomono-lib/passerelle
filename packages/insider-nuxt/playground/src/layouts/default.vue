<script setup lang="ts">
import Playground from 'playground-vue-component'
</script>

<template>
  <section>
    <Header>
      <slot />
    </Header>
    <Playground mode="insider" />
  </section>
</template>
