
import { createCommunicator, type UseCommunicator } from './internals/communicator'
import { createHashObserver } from './internals/hashObserver'
// import { createIframeInternalObserver } from './internals/childObserver'
import type { IframeRef, IframeBridgeOption, InternalObserver } from './types'

/**
 * 引数に iframe タグを設定することで、以下の機能を提供する
 * - iframe の src を書き換えてしまうと、ページがリロードされてしまうため、 src を書き換えずにページを遷移する
 * - iframe 内側のページ遷移を検知し、親側の history 及びページパスへ同期させる
 * @param iframeRef
 */
export function useIframeBridge(iframeRef: IframeRef, opt: IframeBridgeOption): UseCommunicator {
  let parentObserver: InternalObserver
  // const childObserver = createIframeInternalObserver(iframeRef, opt)

  const communicator = createCommunicator(iframeRef, {
    onInit() {
      parentObserver = createHashObserver(communicator, opt)
      parentObserver.observe()
      // childObserver.observe()
    },
    onDestroy() {
      parentObserver.disconnect()
      // childObserver.disconnect()
    }
  })

  return communicator
}
