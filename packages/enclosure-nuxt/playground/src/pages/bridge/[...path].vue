<script setup lang="ts">
import type { BridgeFrame as BridgeFrameComponent } from '#components'
import type { ParentToChild, ChildToParent } from '@passerelle/enclosure-vue'

const route = useRoute()

const defaultPath = `http://localhost:5174${extractChildPath(route.path)}`

function extractChildPath(path: string): string {
  const [, matchedPath] = /^\/bridge(\/.*?)$/.exec(path) ?? []
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

const bridge = ref<typeof BridgeFrameComponent>()

onMounted(() => {})
</script>

<template>
  <BridgeFrame
    class="frame"
    ref="bridge"
    communicate-key="passerelle-playground"
    :initial-src="defaultPath"
    :to-child-path="parentToChild"
    :to-parent-path="childToParent" />
</template>

<style scoped>
.frame {
  border: 1px solid var(--color-border);
}
</style>
