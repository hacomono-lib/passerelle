import type { Ref } from 'vue'
import { createHooks } from 'hookable'
import type { RouteLocationNormalized } from 'vue-router'

type MaybeRef<T> = Ref<T> | T

type IframeRef = MaybeRef<HTMLIFrameElement | null | undefined>

const loggerName = '[IFrameBridge]'

export interface IframeBridgeOption {
  /**
   * iframe 内側の URL を動的に生成します.
   * メソッド内で `useRoute` や `window` へ参照し、現在の URL を元に生成することを想定しています.
   */
  toChildPath: (parentLocation: RouteLocationNormalized) => string

  /**
   * iframe 内側の URL から、親側の URL を生成します.
   * @param childURL iframe 内側の URL
   * @return 親側の path
   */
  toParentPath: (childURL: URL) => string
}

interface HashObserver {
  observe(): void
  disconnect(): void
}

interface IframeHooks {
  parentLocationChange: (parentLocation: RouteLocationNormalized) => void
  childLocationChange: (fullpath: string) => void
}

const hooks = createHooks<IframeHooks>()

export function useIframeBrodgeHook(): typeof hooks {
  return hooks
}

/**
 * 引数に iframe タグを設定することで、以下の機能を提供する
 * - iframe の src を書き換えてしまうと、ページがリロードされてしまうため、 src を書き換えずにページを遷移する
 * - iframe 内側のページ遷移を検知し、親側の history 及びページパスへ同期させる
 * @param iframeRef
 */
export function useIframeBridge(iframeRef: IframeRef, opt: IframeBridgeOption): void {
  if (process.client) {
    initSyncChildToParent(iframeRef, opt)
    initSyncParentToChild(iframeRef, opt)
  }
}

/**
 *
 * @param iframeRef
 */
function initSyncParentToChild(iframeRef: IframeRef, opt: IframeBridgeOption) {
  console.debug(loggerName, 'Init: syncer (parent -> child)')

  const observer = createParentWindowHashObserver((l) =>
    syncHashParentToChild(l, ensureNotNil(unref(iframeRef)), opt)
  )

  onMounted(() => {
    observer.observe()
  })

  onBeforeUnmount(() => {
    observer.disconnect()
  })
}

function createParentWindowHashObserver(
  callback: (l: RouteLocationNormalized) => void
): HashObserver {
  let oldPath = ''
  const observed = (location: RouteLocationNormalized) => {
    const { fullPath } = location
    if (oldPath !== fullPath) {
      console.debug(loggerName, `Observer (parent) : observe ${oldPath} -> ${location.fullPath}`)
      callback(location)
      oldPath = fullPath
    }
  }

  return {
    observe() {
      console.debug(loggerName, 'Observer (parent) : observe start')

      hooks.hook('parentLocationChange', observed)
    },
    disconnect() {
      console.debug(loggerName, 'Observer (parent) : disconnect')
      hooks.removeHook('parentLocationChange', observed)
    }
  }
}

function syncHashParentToChild(
  location: RouteLocationNormalized,
  iframe: HTMLIFrameElement,
  opt: IframeBridgeOption
) {
  const hash = location.hash
  if (iframe.contentWindow && iframe.contentWindow.location.hash !== hash) {
    const path = opt.toChildPath(location)
    if (path) {
      iframe.contentWindow.history.replaceState({}, '', path)
      console.debug(loggerName, `Sync: parent -> child ${path}`)
    }
  }
}

function initSyncChildToParent(iframeRef: IframeRef, opt: IframeBridgeOption) {
  console.debug(loggerName, 'Init: syncer (child -> parent)')
  /// observer を使って、 iframe 配下のすべての tree の変更を検知
  /// 変更検知時に、 url hash が変わっていることを確認する.
  /// onhashchange イベントなど、 iframe 側のイベント発火は効かなかった (おそらく history が上書きされちゃってるため？)
  const observer = createIframeHashObserver(iframeRef, (v) => syncHashChildToParent(v, opt))

  onMounted(() => {
    const iframe = ensureNotNil(unref(iframeRef))

    /// 初期化方法と条件
    /// - `/v2/bridge` に画面遷移からアクセスしたとき .. iframeLoaded は false
    /// - `/v2/bridge/*` に画面遷移からアクセスしたとき .. iframeLoaded は false
    /// - `/v2/bridge` でリロードした時 .. iframeLoaded は false
    /// - `/v2/bridge/*` でリロードした時 .. iframeLoaded は true
    if (iframeLoaded(iframe)) {
      observer.observe()
      return
    }

    iframe.contentWindow!.addEventListener('load', () => {
      observer.observe()
    })
  })

  onBeforeUnmount(() => {
    observer.disconnect()
  })
}

function iframeLoaded(iframe: HTMLIFrameElement): boolean {
  const body = iframe.contentDocument?.querySelector('body')
  return (body?.children ?? []).length > 0
}

function createIframeHashObserver(
  iframeRef: IframeRef,
  callback: (href: string) => void
): HashObserver {
  let oldHref = ''

  const observed = () => {
    const iframe = ensureNotNil(unref(iframeRef))

    const newHref = ensureNotNil(iframe.contentWindow?.location.href)

    if (oldHref !== newHref) {
      console.debug(loggerName, `Observer (child) : observe ${oldHref} -> ${newHref}`)
      callback(newHref)
      oldHref = newHref
    }
  }

  const observer = new MutationObserver(observed)

  return {
    observe() {
      console.debug(loggerName, 'Observer (child) : observe start')
      const iframe = ensureNotNil(unref(iframeRef))

      observer.observe(ensureNotNil(iframe.contentDocument?.querySelector('body')), {
        attributes: false,
        attributeOldValue: false,
        characterData: false,
        characterDataOldValue: false,
        childList: true,
        subtree: true
      })

      hooks.hook('childLocationChange', observed)
    },
    disconnect() {
      console.debug(loggerName, 'Observer (child) : disconnect')
      observer.disconnect()
      hooks.removeHook('childLocationChange', observed)
    }
  }
}

function syncHashChildToParent(newValue: string, opt: IframeBridgeOption) {
  const url = new URL(newValue)
  const context = useNuxtApp()
  const baseURL = context.$config.app.baseURL ?? '/'
  const path = opt.toParentPath(url)
  history.replaceState({}, '', `${baseURL}${path}`)

  console.debug(loggerName, `Sync: child -> parent ${path}`)
}
