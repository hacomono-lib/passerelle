import type { Plugin } from 'vue'
import type { Router } from 'vue-router'

import { useCommunicator } from './composables/useCommunicator'

export { useCommunicator }

export function insider(router: Router): Plugin {
  return {
    install(app, opt) {
      // applyMiddleware(router, opt.path)
    }
  }
}
