import { type Communicator } from '@passerelle/core'
import { createCommunicator, type UseCommunicator } from './internals/communicator'
import { onBeforeRouteUpdate, type RouteLocationNormalized } from 'vue-router'
import type { IframeRef, IframeBridgeOption } from './types'

/**
 * 引数に iframe タグを設定することで、以下の機能を提供する
 * - iframe の src を書き換えてしまうと、ページがリロードされてしまうため、 src を書き換えずにページを遷移する
 * - iframe 内側のページ遷移を検知し、親側の history 及びページパスへ同期させる
 * @param iframeRef
 */
export function useIframeBridge(iframeRef: IframeRef, opt: IframeBridgeOption): UseCommunicator {
  const { toChildPath: _toChildPath, toParentPath: _toParentPath, ...config } = opt
  const communicator = createCommunicator(iframeRef, config)

  onBeforeRouteUpdate((to, from, next) => {
    if (isSamePathTransition(to, from)) {
      syncHashParentToChild(to, communicator, opt)
    }
    return next()
  })

  return communicator
}

function isSamePathTransition(to: RouteLocationNormalized, from: RouteLocationNormalized): boolean {
  return to.name === from.name && to.path !== from.path
}

function syncHashParentToChild(
  location: RouteLocationNormalized,
  communicator: Communicator,
  opt: IframeBridgeOption
) {
  const logPrefix = opt.logPrefix ?? '[passerelle/enclosure/vue]'
  const loggerFeatureKey = 'observer (parent) : sync parent -> child :'
  const path = opt.toChildPath(location)

  if (!path) {
    console.warn(logPrefix, loggerFeatureKey, `path is not found. (inputs: ${path})`)
    return
  }

  console.debug(logPrefix, loggerFeatureKey, `(path: ${path})`)
  communicator.navigate({
    path
  })
}
