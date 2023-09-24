import type { Ref } from 'vue'
import type { RouteLocationNormalized } from 'vue-router'
import type { CommunicateConfig, NavigateMessage, Communicator } from '@passerelle/enclosure-core'
import type { RouteLocationRaw } from 'vue-router'

type MaybeRef<T> = Ref<T> | T

export type IframeRef = MaybeRef<HTMLIFrameElement | null | undefined>

export type ParentToChild = (parentLocation: RouteLocationNormalized) => string

export type ChildToParent = (navigationMessage: NavigateMessage) => RouteLocationRaw

export type UseCommunicator = Partial<Omit<Communicator, 'destroy' | 'navigate'>>

export interface IframeBridgeOption extends CommunicateConfig {
  /**
   *
   */
  toChildPath: ParentToChild

  /**
   *
   */
  toParentPath: ChildToParent
}
