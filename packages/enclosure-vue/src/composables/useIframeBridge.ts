import { loggerKey, type Communicator } from '@passerelle/core'
import { createCommunicator, type UseCommunicator } from './internals/communicator'
import { onBeforeRouteUpdate, type RouteLocationNormalized } from 'vue-router'
import type { IframeRef, IframeBridgeOption } from './types'

const loggerFeatureKey = 'observer (parent) :'

/**
 * 引数に iframe タグを設定することで、以下の機能を提供する
 * - iframe の src を書き換えてしまうと、ページがリロードされてしまうため、 src を書き換えずにページを遷移する
 * - iframe 内側のページ遷移を検知し、親側の history 及びページパスへ同期させる
 * @param iframeRef
 */
export function useIframeBridge(iframeRef: IframeRef, opt: IframeBridgeOption): UseCommunicator {
  const communicator = createCommunicator(iframeRef, { })

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
