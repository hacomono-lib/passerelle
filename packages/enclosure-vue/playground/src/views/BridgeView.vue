<script setup lang="ts">
import { useRoute } from 'vue-router';
import type { ParentToChild, ChildToParent } from '@passerelle/enclosure-vue'

const route = useRoute()

const defaultPath = `http://localhost:5174${extractChildPath(route.path)}`

function extractChildPath(path: string): string {
  const [,matchedPath] = /^\/bridge(\/.*?)$/.exec(path) || []
  if (!matchedPath) {
    throw new Error(`invalid path: ${path}`)
  }
  return matchedPath
}

const parentToChild: ParentToChild = (location) => {
  return extractChildPath(location.path)
}

const childToParent: ChildToParent = ({ path, params }) => {
  return { path: `/bridge${path}`, params }
}
</script>

<template>
  <BridgeFrame
    communicate-key="passerelle-playground"
    :initial-src="defaultPath"
    :to-child-path="parentToChild"
    :to-parent-path="childToParent" />
</template>
