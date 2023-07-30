<script setup lang="ts">
import { useRoute } from 'vue-router';
import {
  type ParentToChild,
  type ChildToParent
} from '../../../src/components/types'

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

const childToParent: ChildToParent = (url) => {
  return '/hoge'
}
</script>

<template>
  <BridgeFrame
    :initial-src="defaultPath"
    key="passerelle-playground"
    :to-child-path="parentToChild"
    :to-parent-path="childToParent" />
</template>
