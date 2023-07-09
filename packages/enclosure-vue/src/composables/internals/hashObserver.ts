import { loggerKey } from '@passerelle/core'
import type { RouteLocationNormalized } from 'vue-router'

import type { InternalObserver, IframeBridgeOption } from '../types'
import { hook } from '../hooker'
import type { UseCommunicator } from './communicator'

export function createHashObserver(communicator: UseCommunicator, opt: IframeBridgeOption): InternalObserver {
  return createObserver((l) => syncHashParentToChild(l, communicator, opt))
}

function createObserver(
  callback: (l: RouteLocationNormalized) => void
): InternalObserver {
  let oldPath = ''
  const observed = (location: RouteLocationNormalized) => {
    const { fullPath } = location
    if (oldPath !== fullPath) {
      console.debug(loggerKey, `Observer (parent) : observe ${oldPath} -> ${location.fullPath}`)
      callback(location)
      oldPath = fullPath
    }
  }

  return {
    observe() {
      console.debug(loggerKey, 'Observer (parent) : observe start')
      hook.hook('parentLocationChange', observed)
    },
    disconnect() {
      console.debug(loggerKey, 'Observer (parent) : disconnect')
      hook.removeHook('parentLocationChange', observed)
    }
  }
}

function syncHashParentToChild(
  location: RouteLocationNormalized,
  communicator: UseCommunicator,
  opt: IframeBridgeOption
) {
  const path = opt.toChildPath(location)
  if (path) {
    // iframe.contentWindow.history.replaceState({}, '', path)
    console.debug(loggerKey, `Sync: parent -> child ${path}`)
    communicator.navigate({
      path
    })
  }
}

