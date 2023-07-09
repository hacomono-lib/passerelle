import { createHooks } from 'hookable'
import type { RouteLocationNormalized } from 'vue-router'

interface IframeHooks {
  parentLocationChange: (parentLocation: RouteLocationNormalized) => void
  childLocationChange: (fullpath: string) => void
}

export const hook = createHooks<IframeHooks>()
