import type { App, InjectionKey } from 'vue'
import type { Router } from 'vue-router'
import { type Communicator, createCommunicator as create, type NavigateMessage, type HrefMessage, type LayoutMetrix } from '@passerelle/insider-core'

export interface InsiderVueConfig {
  /**
   * Router instance
   */
  router: Router

  /**
   * Origin to send messages to
   * @default {string} same origin
   */
  origin?: string

  /**
   *
   */
  key?: string

  /**
   *
   * @param this
   * @param app
   * @param value
   */
  onNavigate?(this: Communicator, app: App, value: NavigateMessage): void

  /**
   *
   * @param this
   * @param app
   * @param value
   */
  onHrefNavigate?(this: Communicator, app: App, value: HrefMessage): void

  /**
   *
   * @param this
   * @param app
   * @param value
   */
  onUpdateLayout?(this: Communicator, app: App, value: LayoutMetrix): void

  /**
   *
   * @param this
   * @param app
   */
  onInit?(this: Communicator, app: App): void

  /**
   *
   * @param this
   * @param app
   */
  onDestroy?(this: Communicator, app: App): void
}

export const LAYOUT_KEY = Symbol() as InjectionKey<LayoutMetrix>

export function initCommunicator(app: App, opt: InsiderVueConfig) {
  const communicator = createCommunicator(app, opt)
  applyMiddleware(opt.router, communicator)
  initDestructor(communicator)
}

function createCommunicator(app: App, opt: InsiderVueConfig): Communicator {
  return create({
    origin: opt?.origin,
    key: opt?.key,
    async onNavigate(value) {
      opt?.onNavigate?.call(this, app, value)

      opt.router.push({ path: value.path, params: value.params })
    },
    async onHrefNavigate(value) {
      opt?.onHrefNavigate?.call(this, app, value)

      window.location.href = value.href
    },
    async onUpdateLayout(value) {
      opt?.onUpdateLayout?.call(this, app, value)

      app.provide(LAYOUT_KEY, value)
    },
    onInit() {
      opt?.onInit?.call(this, app)
    },
    onDestroy() {
      opt?.onDestroy?.call(this, app)
    }
  })
}

export function applyMiddleware(router: Router, communicator: Communicator) {
  router.beforeEach((to, _from, next) => {
    communicator.navigate({ path: to.path, params: to.params })
    return next()
  })
}

function initDestructor(communicator: Communicator) {
  const originBeforeUnload = window.onbeforeunload
  window.onbeforeunload = function (event) {
    communicator.destroy()
    originBeforeUnload?.call(window, event)
  }
}
