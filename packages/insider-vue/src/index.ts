import type { Plugin, App } from 'vue'

import { initCommunicator, LAYOUT_KEY, COMMUNICATOR_KEY, type InsiderVueConfig } from './communicator'

export { onUpdateLayout, useCommunicator } from './composables'

export { type InsiderVueConfig, LAYOUT_KEY, COMMUNICATOR_KEY }

function isSSR(): boolean {
  return typeof window === 'undefined'
}

export const insider: Plugin<InsiderVueConfig> = {
  install(app: App, opt: InsiderVueConfig) {
    if (isSSR()) return

    initCommunicator(app, opt)
  }
}
