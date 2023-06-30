import type { RouteLocationNormalized } from '#vue-router'

const loggerName = '[IFrameBridge]'

function updateURLWithoutNavigation(to: RouteLocationNormalized, from: RouteLocationNormalized) {
  if (to.name === from?.name && to.path !== from?.path) {
    updateURL(to)
    return false
  }

  return true
}

function updateURL(to: RouteLocationNormalized) {
  const context = useNuxtApp()
  const baseURL = context.$config.app.baseURL ?? '/'
  const href = `${baseURL}${to.fullPath}`

  const hooks = useIframeBrodgeHook()

  console.debug(loggerName, 'Update URL (without navigation)', href)
  history.pushState({}, '', href)
  hooks.callHook('parentLocationChange', to)
}

export default defineNuxtRouteMiddleware(updateURLWithoutNavigation)
