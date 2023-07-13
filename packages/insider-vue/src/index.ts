import type { Plugin, App } from 'vue'
import type { Router } from 'vue-router'

import { createCommunicator } from '@passerelle/insider-core'
import { applyMiddleware } from './middlewares/observeTransition'
import type { Communicator, NavigateMessage } from '@passerelle/core'
import type { LayoutMetrix } from '@passerelle/core'
import type { HrefMessage } from '@passerelle/core'

import { onBeforeHrefNavigate, onBeforeNavigate, onUpdateLayout } from './composables/events'

export { onBeforeHrefNavigate, onBeforeNavigate, onUpdateLayout }

export interface InsiderVueConfig {
  router: Router

  /**
   * Origin to send messages to
   * @default {string} same origin
   */
  origin?: string

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

export const insider: Plugin<InsiderVueConfig> = {
  install(app: App, opt: InsiderVueConfig) {
    const communicator = createCommunicator({
      origin: opt?.origin,
      onNavigate(value) {
        opt?.onNavigate?.call(this, app, value)
      },
      onHrefNavigate(value) {
        opt?.onHrefNavigate?.call(this, app, value)
      },
      onUpdateLayout(value) {
        opt?.onUpdateLayout?.call(this, app, value)
      },
      onInit() {
        opt?.onInit?.call(this, app)
      },
      onDestroy() {
        opt?.onDestroy?.call(this, app)
      }
    })
    applyMiddleware(opt.router, communicator)

    const originBeforeUnload = window.onbeforeunload
    window.onbeforeunload = function (event) {
      communicator.destroy()
      originBeforeUnload?.call(window, event)
    }
  }
}
