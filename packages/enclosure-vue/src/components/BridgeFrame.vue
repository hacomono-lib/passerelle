<script lang="ts" setup>
import { ref } from 'vue'
import type { NavigateMessage, HrefMessage } from '@passerelle/enclosure-core'
import type { ChildToParent, ParentToChild } from './types'
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
  toChildPath: ParentToChild

  /**
   *
   * @param childUrl
   */
  toParentPath: ChildToParent

  /**
   * iframe の postMessage で送信する際の origin を指定する.
   * この値を指定しない場合、 今のページの origin が使用される.
   */
  origin?: string | undefined
}

export interface Emit {
  (e: 'navigate', value: NavigateMessage): void
  (e: 'href', value: HrefMessage): void
}

const props = defineProps<Props>()

const emit = defineEmits<Emit>()

const frame = ref<HTMLIFrameElement>()

useIframeBridge(frame, {
  toChildPath: (location) => props.toChildPath(location),
  toParentPath: (url) => props.toParentPath(url),
  origin: props.origin,
  onNavigate(value) {
    emit('navigate', value)
  },
  onHrefNavigate(value) {
    emit('href', value)
  }
})
</script>

<template>
  <iframe
    ref="frame"
    style="width: 100%; height: 100%; border: none"
    :src="initialSrc" />
</template>
