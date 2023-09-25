import type { Plugin } from 'vue'
import BridgeFrame from './components/BridgeFrame.vue'
export type { ParentToChild, ChildToParent, IframeBridgeConfig } from './lib/types'

export { BridgeFrame }

export const enclosure = {
  install(app) {
    app.component('BridgeFrame', BridgeFrame)
  }
} satisfies Plugin
