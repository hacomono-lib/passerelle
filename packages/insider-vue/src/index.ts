import type { Plugin, App } from 'vue'

import {
  initCommunicator,
  LAYOUT_KEY,
  COMMUNICATOR_KEY,
  type InsiderVueConfig
} from './communicator'
import type { Communicator } from '@passerelle/insider-core'

export { onUpdateLayout, useCommunicator } from './composables'

export { createCommunicator } from './communicator'

export { type InsiderVueConfig, LAYOUT_KEY, COMMUNICATOR_KEY }

function isSSR(): boolean {
  return typeof window === 'undefined'
}

export const insider = {
  install(app: App, opt: InsiderVueConfig) {
    if (isSSR()) return

    initCommunicator(app, opt)
  }
} satisfies Plugin<InsiderVueConfig | Communicator>
