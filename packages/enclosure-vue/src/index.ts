import type { Plugin } from 'vue'
import type { Router } from 'vue-router'

import { applyMiddleware } from './middlewares/iframeSync'
import BridgeFrame from './components/BridgeFrame.vue'
import { useIframeBridge } from './composables/useIframeBridge'

export { BridgeFrame, useIframeBridge }

interface EnclosurePluginOption {
  path: string | string[]
}

export default function (router: Router): Plugin<EnclosurePluginOption> {
  return {
    install(app, opt) {
      applyMiddleware(router, opt.path)
      app.component('BridgeFrame', BridgeFrame)
    }
  } satisfies Plugin<EnclosurePluginOption>
}
