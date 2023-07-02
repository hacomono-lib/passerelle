<script lang="ts" setup>
import type { RouteLocationNormalized } from 'vue-router'
import { ref } from 'vue'
import { useIframeBridge } from '../composables/useIframeBridge'

export interface Props {
  /**
   *
   */
  initialSrc: string

  /**
   * iframe 内の URL を動的に生成する関数を指定する.
   * この関数は、 親の URL が変更される時にコールされる.
   * @returns iframe 内の URL のパス (host を含まない)
   */
  toChildPath: (parentLocation: RouteLocationNormalized) => string

  /**
   *
   * @param childUrl
   */
  toParentPath: (childUrl: URL) => string
}

const props = defineProps<Props>()

const frame = ref<HTMLIFrameElement>()

useIframeBridge(frame, {
  toChildPath: (location) => props.toChildPath(location),
  toParentPath: (url) => props.toParentPath(url)
})
</script>

<template>
  <keep-alive>
    <iframe
      ref="frame"
      class="bridging-iframe"
      :src="initialSrc" />
  </keep-alive>
</template>

<style lang="scss" scoped>
.bridging-iframe {
  width: 100%;
  height: 100%;
  border: none;
}
</style>
