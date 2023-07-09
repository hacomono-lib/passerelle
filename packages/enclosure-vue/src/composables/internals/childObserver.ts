// import { unref } from 'vue'
// import { ensureNotNil } from 'type-assurer'
// import { loggerKey } from '@passerelle/core'

// import type { InternalObserver, IframeRef, IframeBridgeOption } from '../types'

// export function createIframeInternalObserver(iframeRef: IframeRef, opt: IframeBridgeOption): InternalObserver {
//   return createObserver(iframeRef, (v) => syncHashChildToParent(v, opt))
// }

// function iframeLoaded(iframe: HTMLIFrameElement): boolean {
//   const body = iframe.contentDocument?.querySelector('body')
//   return (body?.children ?? []).length > 0
// }

// function createObserver(
//   iframeRef: IframeRef,
//   callback: (href: string) => void
// ): InternalObserver {
//   let oldHref = ''

//   const observed = () => {
//     const iframe = ensureNotNil(unref(iframeRef))

//     const newHref = ensureNotNil(iframe.contentWindow?.location.href)

//     if (oldHref !== newHref) {
//       console.debug(loggerKey, `Observer (child) : observe ${oldHref} -> ${newHref}`)
//       callback(newHref)
//       oldHref = newHref
//     }
//   }

//   const observer = new MutationObserver(observed)

//   return {
//     observe() {
//       console.debug(loggerKey, 'Observer (child) : observe start')
//       const iframe = ensureNotNil(unref(iframeRef))

//       const startObserve = () => {
//         observer.observe(ensureNotNil(iframe.contentDocument?.querySelector('body')), {
//           attributes: false,
//           attributeOldValue: false,
//           characterData: false,
//           characterDataOldValue: false,
//           childList: true,
//           subtree: true
//         })
//         hooks.hook('childLocationChange', observed)
//       }

//       /// 初期化方法と条件
//       /// - `/v2/bridge` に画面遷移からアクセスしたとき .. iframeLoaded は false
//       /// - `/v2/bridge/*` に画面遷移からアクセスしたとき .. iframeLoaded は false
//       /// - `/v2/bridge` でリロードした時 .. iframeLoaded は false
//       /// - `/v2/bridge/*` でリロードした時 .. iframeLoaded は true
//       if (iframeLoaded(iframe)) {
//         startObserve()
//         return
//       }

//       iframe.contentWindow!.addEventListener('load', () => {
//         startObserve()
//       })
//     },
//     disconnect() {
//       console.debug(loggerKey, 'Observer (child) : disconnect')
//       observer.disconnect()
//       hooks.removeHook('childLocationChange', observed)
//     }
//   }
// }

// function syncHashChildToParent(newValue: string, opt: IframeBridgeOption) {
//   const url = new URL(newValue)
//   const path = opt.toParentPath(url)
//   history.replaceState({}, '', `${opt.baseURL ?? '/'}${path}`)

//   console.debug(loggerKey, `Sync: child -> parent ${path}`)
// }
