import { onBeforeUnmount, onMounted, unref } from 'vue'
import { onBeforeRouteUpdate, useRouter, type RouteLocationNormalized } from 'vue-router'
import { ensureNotNil } from 'type-assurer'
import {
  createCommunicator as createCommunicatorInternal,
  type Communicator
} from '@passerelle/enclosure-core'

import type { IframeRef, IframeBridgeConfig } from '../lib/types'
import { name } from '../../package.json'

const isSSR = typeof window === 'undefined'

const logPrefix = `[${name}]`

/**
 * 引数に iframe タグを設定することで、以下の機能を提供する
 * - iframe の src を書き換えてしまうと、ページがリロードされてしまうため、 src を書き換えずにページを遷移する
 * - iframe 内側のページ遷移を検知し、親側の history 及びページパスへ同期させる
 * @param iframeRef
 * @param config
 * @return
 */
export function useIframeBridge(iframeRef: IframeRef, config: IframeBridgeConfig) {
  if (isSSR) return

  const { toParentPath } = config

  const router = useRouter()

  let communicator: Communicator | undefined = undefined

  onMounted(() => {
    communicator = createCommunicatorInternal(ensureNotNil(unref(iframeRef)), config)

    communicator.logPrefix = logPrefix

    communicator!.hooks.on('navigate', (value) => {
      router.replace(toParentPath(value))
    })
  })

  onBeforeRouteUpdate((to, from, next) => {
    if (isSamePathTransition(to, from)) {
      syncHashParentToChild(to, ensureNotNil(communicator), config)
    }
    return next()
  })

  onBeforeUnmount(() => {
    communicator?.destroy()
  })
}

function isSamePathTransition(to: RouteLocationNormalized, from: RouteLocationNormalized): boolean {
  return to.name === from.name && to.path !== from.path
}

function syncHashParentToChild(
  location: RouteLocationNormalized,
  communicator: Communicator,
  opt: IframeBridgeConfig
) {
  const logScope = 'observer (parent) : sync parent -> child :'
  const path = opt.toChildPath(location)

  if (!path) {
    console.warn(logPrefix, logScope, `path is not found. (inputs: ${path})`)
    return
  }

  console.debug(logPrefix, logScope, `(path: ${path})`)
  communicator.navigate({
    path
  })
}
