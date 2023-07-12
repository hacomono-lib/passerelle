import type { CommunicateConfig, Communicator } from '@passerelle/core'
import { createCommunicator as createCommunicatorInternal } from '@passerelle/enclosure-core'
import type { IframeRef } from '../types'
import { onBeforeUnmount, onMounted, unref } from 'vue'
import { ensureNotNil } from 'type-assurer'

export type UseCommunicator = Omit<Communicator, 'destroy' | 'navigate'>

export function createCommunicator(iframeRef: IframeRef, config?: CommunicateConfig): Communicator {
  let communicator: Communicator | null = null

  onMounted(() => {
    communicator = createCommunicatorInternal(ensureNotNil(unref(iframeRef)), config)
  })

  onBeforeUnmount(() => {
    communicator?.destroy()
  })

  return {
    sendValue: (...args) => communicator?.sendValue(...args),
    sendLayout: (...args) => communicator?.sendLayout(...args),
    href: (...args) => communicator?.href(...args),
    navigate: (...args) => communicator?.navigate(...args),
    addReceiver: (...args) => communicator?.addReceiver(...args),
    removeReceiver: (...args) => communicator?.removeReceiver(...args),
    destroy: () => communicator?.destroy(),
  } as Communicator
}
