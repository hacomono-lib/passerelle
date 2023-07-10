<script setup lang="ts">
import {
  type ParentToChild,
  type ChildToParent
} from '../../../src/components/types'

const parentToChild: ParentToChild = (location) => {
  const [,matchedPath] = /^\/bridge(\/.*?)$/.exec(location.path) || []
  if (!matchedPath) {
    throw new Error('invalid path')
  }
  return matchedPath
}

const childToParent: ChildToParent = (url) => {
  return '/hoge'
}
</script>

<template>
  <BridgeFrame
    initial-src="http://localhost:8081/"
    :to-child-path="parentToChild"
    :to-parent-path="childToParent" />
</template>
