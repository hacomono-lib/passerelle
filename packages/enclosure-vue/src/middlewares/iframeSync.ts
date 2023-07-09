import type { Router, NavigationGuardWithThis, RouteLocationNormalized } from 'vue-router'
import { hook } from '../composables/hooker'

export function applyMiddleware(router: Router, path: string | string[]): void {
  router.beforeEach(createMiddleware(path))
}

function createMiddleware(path: string | string[]): NavigationGuardWithThis<undefined> {
  return function(to, from, next) {
    if (isSamePathTransition(to, from) && isTargetPath(to, path)) {
      updateURL(to)
      return false
    }

    return next()
  }
}

function isSamePathTransition(to: RouteLocationNormalized, from: RouteLocationNormalized): boolean {
  return to.name === from.name && to.path !== from.path
}

function isTargetPath(to: RouteLocationNormalized, path: string | string[]): boolean {
  return (typeof path === 'string' ? [path] : path).includes(to.path)
}

function updateURL(to: RouteLocationNormalized): void {
  hook.callHook('parentLocationChange', to)
}
