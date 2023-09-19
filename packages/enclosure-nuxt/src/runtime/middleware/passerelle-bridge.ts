/// <reference path="../../../playground/.nuxt/types/imports.d.ts" />
import { RouteLocationNormalized, RouteRecordNormalized } from 'vue-router'

function shouldTransitionWithPasserelle(a: RouteLocationNormalized, b: RouteLocationNormalized): boolean {
  return a.name === b.name && a.path !== b.path
}

export default defineNuxtRouteMiddleware((to, from) => {
  console.log('passerelle-bridge')
  if (process.server) {
    return true
  }

  if (shouldTransitionWithPasserelle(to, from)) {
    const context = useNuxtApp()
    const baseURL = context.$config.app.baseURL ?? '/'
    const href = `${baseURL}${to.fullPath}`.replace(/^\/\//, '/')

    history.pushState({}, '', href)
    return false
  }

  return true
})
