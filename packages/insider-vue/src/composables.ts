import { inject, onUnmounted } from 'vue'
import type { Communicator, LayoutMetrix, MessageKey, Json } from '@passerelle/insider-core'

import { COMMUNICATOR_KEY } from './communicator'
import { isSSR } from './common'

export function onUpdateLayout(callback: (value: LayoutMetrix) => void | Promise<void>): void {
  const communicator = useCommunicator()

  communicator.hooks.on('layout', callback)

  onUnmounted(() => {
    communicator.hooks.off('layout', callback)
  })
}

export function onReceivedData<T extends Json>(
  key: MessageKey<T>,
  callback: (value: T) => void
): void {
  const communicator = useCommunicator()

  const callbackWrap = (k: string, v: unknown) => {
    if (k === key) callback(v as T)
  }

  communicator.hooks.on('data', callbackWrap)

  onUnmounted(() => {
    communicator.hooks.off('data', callbackWrap)
  })
}

export function useCommunicator(): Communicator {
  if (isSSR) throw Error('passerelle communicator can not be used in SSR')

  const communicator = inject(COMMUNICATOR_KEY)
  if (!communicator) throw new Error('passerelle insider is not installed')

  return communicator
}
