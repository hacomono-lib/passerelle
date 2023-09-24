<script lang="ts" setup>
import { ref } from 'vue'
import type {
  NavigateMessage,
  HrefMessage,
  MessageKey,
  Json
} from '@passerelle/enclosure-core'

import type { ChildToParent, ParentToChild } from '../lib/types'
import { useIframeBridge } from '../composables/useIframeBridge'

export interface Props {
  /**
   * URO to be specified in the iframe's src attribute.
   */
  initialSrc: string

  /**
   * Function to craete a new path on the insider side based on the transition information of the enclosuere side.
   * This function is called whenever the URL on the enclosure side changes.
   * @param location
   * @returns {string} Path of the URL inside the iframe (excluding host)
   */
  toChildPath: ParentToChild

  /**
   * Function to create a new path on the enclosure side based on the transition information of the insider side.
   * This function is called whenever the URL on the insider side changes.
   * @param childUrl
   * @returns {string} Path of the URL on the enclosure side (excluding host)
   */
  toParentPath: ChildToParent

  /**
   * Specify the origin when sending with iframe's postMessage.
   * If this value is not specified, the origin of the current page will be used.
   * @default location.origin
   */
  origin?: string | undefined

  /**
   * Timeout for the collab request
   * @default 1000
   */
  collabRequestTimeout?: number

  /**
   * If set to true, passerelle must exist on both the outside and inside of the iframe, enclosure and insider must have the same key.
   * If set to false, allow unset key.
   * @default false
   */
  requiredCollab?: boolean

  /**
   * Specify the key when sending with iframe's postMessage.
   */
  communicateKey?: string | undefined

  /**
   *
   */
  logPrefix?: string | undefined
}

export interface SendData<T extends Json> {
  key: MessageKey<T>
  value: T
}

export interface Emit {
  (e: 'navigate', value: NavigateMessage): void
  (e: 'href', value: HrefMessage): void
  <T extends Json>(e: 'data', value: SendData<T>): void
}

const props = defineProps<Props>()

const emit = defineEmits<Emit>()

const frame = ref<HTMLIFrameElement>()

useIframeBridge(frame, {
  toChildPath: (location) => props.toChildPath(location),
  toParentPath: (url) => props.toParentPath(url),
  origin: props.origin,
  key: props.communicateKey,
  requireCollab: props.requiredCollab,
  collabRequestTimeout: props.collabRequestTimeout,
  onInit() {
    this.hooks.on('navigate', (value) => {
      emit('navigate', value)
    })

    this.hooks.on('href', (value) => {
      emit('href', value)
    })

    this.hooks.on('data', (key, value) => {
      emit('data', { key, value })
    })
  }
})
</script>

<template>
  <iframe
    ref="frame"
    :src="initialSrc" />
</template>

<style scoped>
iframe {
  width: 100%;
  height: 100%;
  border: none;
}
</style>
