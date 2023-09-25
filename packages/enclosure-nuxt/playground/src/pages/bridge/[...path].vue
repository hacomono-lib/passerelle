<script setup lang="ts">
import type { BridgeFrame as BridgeFrameComponent } from '#components'
import type { ParentToChild, ChildToParent } from '@passerelle/enclosure-vue'

definePageMeta({
  key: 'bridge'
})

const route = useRoute()

const defaultPath = `http://localhost:5176${extractChildPath(route.path)}`

function extractChildPath(path: string): string {
  const [, matchedPath] = /^\/bridge(\/.*?)$/.exec(path) ?? []
  if (!matchedPath) {
    throw new Error(`invalid path: ${path}`)
  }
  return matchedPath
}

const parentToChild = ((location) => {
  return extractChildPath(location.path)
}) satisfies ParentToChild

const childToParent = (({ path, params }) => {
  return { path: `/bridge${path}`, params }
}) satisfies ChildToParent

const bridge = ref<typeof BridgeFrameComponent>()
</script>

<template>
  <BridgeFrame
    class="frame"
    ref="bridge"
    communicate-key="passerelle-playground"
    :initial-src="defaultPath"
    :to-child-path="parentToChild"
    :to-parent-path="childToParent"
    required-collab />
</template>

<style scoped>
.frame {
  border: 1px solid var(--color-border);
}
</style>
