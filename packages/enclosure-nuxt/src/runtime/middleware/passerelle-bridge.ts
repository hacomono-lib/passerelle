/// <reference path="../../../playground/.nuxt/types/imports.d.ts" />
import { RouteLocationNormalized, RouteRecordNormalized } from 'vue-router'

function isSameRoute(a: RouteLocationNormalized, b: RouteLocationNormalized): boolean {
  const findPasserelleRote = (routes: RouteLocationNormalized): RouteRecordNormalized[] =>
    routes.matched.filter((a) => (a.meta as any).middleware?.includes('passerelle'))

  const matchedA = findPasserelleRote(a)
  const matchedB = findPasserelleRote(b)

  // 同一オブジェクトの組が　ｔ つでもあれば同一ルートとみなす
  return matchedA.some((a) => matchedB.some((b) => a === b))
}

export default defineNuxtRouteMiddleware((to, from) => {
  if (process.server) {
    return false
  }

  if (isSameRoute(to, from)) {
    location.replace(to.fullPath)
    return false
  }

  return true
})
