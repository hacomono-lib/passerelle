import type { Ref } from 'vue'
import type { RouteLocationNormalized } from 'vue-router'

type MaybeRef<T> = Ref<T> | T

export type IframeRef = MaybeRef<HTMLIFrameElement | null | undefined>

export interface InternalObserver {
  observe(): void
  disconnect(): void
}

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

  /**
   *
   */
  baseURL?: string
}

