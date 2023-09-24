import type { Plugin, App } from 'vue'
import type { Communicator } from '@passerelle/insider-core'

import {
  initCommunicator,
  LAYOUT_KEY,
  COMMUNICATOR_KEY,
  type InsiderVueConfig
} from './communicator'

export { onUpdateLayout, useCommunicator } from './composables'

export { createCommunicator } from './communicator'

export { type InsiderVueConfig, LAYOUT_KEY, COMMUNICATOR_KEY }

export const insider = {
  install(app: App, opt: InsiderVueConfig) {
    initCommunicator(app, opt)
  }
} satisfies Plugin<InsiderVueConfig | Communicator>
