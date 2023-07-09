import type { RouteLocationNormalized } from 'vue-router'

export type ParentToChild = (parentLocation: RouteLocationNormalized) => string

export type ChildToParent = (childUrl: URL) => string
