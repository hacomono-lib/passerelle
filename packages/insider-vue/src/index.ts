import type { Plugin, App } from 'vue'

import { isSSR } from '@passerelle/lib'

import { initCommunicator, LAYOUT_KEY, type InsiderVueConfig } from './communicator'

export { onUpdateLayout } from './hooks'

export { type InsiderVueConfig, LAYOUT_KEY }

export const insider: Plugin<InsiderVueConfig> = {
  install(app: App, opt: InsiderVueConfig) {
    if (isSSR()) return

    initCommunicator(app, opt)
  }
}
