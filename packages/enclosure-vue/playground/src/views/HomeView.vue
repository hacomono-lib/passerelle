<script setup lang="ts">
import {
  type ParentToChild,
  type ChildToParent
} from '../../../src/components/types'

const parentToChild: ParentToChild = (location) => { return location.hash }

const childToParent: ChildToParent = (url) => { return '/hoge' }
</script>

<template>
  <main>
    <BridgeFrame
      initial-src="http://localhost:8081/"
      :parent-to-child="parentToChild"
      :child-to-parent="childToParent" />
  </main>
</template>

<style scoped>
main {
  height: 80vh;
  width: 45vh;
}
</style>
