import { ref, type App, type InjectionKey, type Ref } from 'vue'
import type { Router } from 'vue-router'
import { createCommunicator as create } from '@passerelle/insider-core'
import type { Communicator, LayoutMetrix, CommunicateConfig } from '@passerelle/insider-core'

import { isSSR } from './common'
import { name } from '../package.json'

export const LAYOUT_KEY = Symbol() as InjectionKey<Ref<LayoutMetrix | undefined>>

export const COMMUNICATOR_KEY = Symbol() as InjectionKey<Communicator>

const logPrefix = `[${name}]`

export interface InsiderVueConfig extends CommunicateConfig {
  router: Router
  communicator?: Communicator
}

export function initCommunicator(app: App, config: InsiderVueConfig) {
  if (isSSR) return

  const communicator = config.communicator ?? createCommunicator(config)

  const layout = ref<LayoutMetrix | undefined>()
  app.provide(LAYOUT_KEY, layout)
  app.provide(COMMUNICATOR_KEY, communicator)

  communicator.hooks.on('href', (value) => {
    window.location.href = value.href
  })

  communicator.hooks.on('layout', (value) => {
    layout.value = value
  })

  communicator.hooks.on('navigate', (value) => {
    const { path, params = {} } = value
    ;(config as InsiderVueConfig).router.replace({ path, params })
  })

  applyMiddleware(config.router, communicator)

  initDestructor(communicator)
}

export function createCommunicator(config: Omit<InsiderVueConfig, 'router'>): Communicator {
  const communicator = create({
    origin: config.origin,
    key: config.key,
    onInit() {
      config.onInit?.call(this)
    },
    onDestroy() {
      config.onDestroy?.call(this)
    }
  })
  communicator.logPrefix = logPrefix
  return communicator
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
