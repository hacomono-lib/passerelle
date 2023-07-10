import { loggerKey, type Communicator } from '@passerelle/core'
import type { RouteLocationNormalized } from 'vue-router'

import type { InternalObserver, IframeBridgeOption } from '../types'
import { hook } from '../hooker'

const loggerFeatureKey = 'observer (parent) :'

export function createHashObserver(
  communicator: Communicator,
  opt: IframeBridgeOption
): InternalObserver {
  return createObserver((l) => syncHashParentToChild(l, communicator, opt))
}

function createObserver(callback: (l: RouteLocationNormalized) => void): InternalObserver {
  let oldPath = ''
  const observed = (location: RouteLocationNormalized) => {
    const { fullPath } = location
    if (oldPath !== fullPath) {
      console.debug(loggerKey, `observer (parent) : observed "${oldPath}" -> "${location.fullPath}"`)
      callback(location)
      oldPath = fullPath
    }
  }

  return {
    observe() {
      console.debug(loggerKey, loggerFeatureKey, 'observe start')
      hook.hook('parentLocationChange', observed)
    },
    disconnect() {
      console.debug(loggerKey, loggerFeatureKey, 'disconnect')
      hook.removeHook('parentLocationChange', observed)
    }
  }
}

function syncHashParentToChild(
  location: RouteLocationNormalized,
  communicator: Communicator,
  opt: IframeBridgeOption
) {
  const path = opt.toChildPath(location)

  if (!path) {
    console.warn(
      loggerKey,
      loggerFeatureKey,
      `sync: parent -> child: path is not found. (inputs: ${path})`
    )
    return
  }

  console.debug(loggerKey, loggerFeatureKey, `sync: parent -> child (path: ${path})`)
  communicator.navigate({
    path
  })
}
