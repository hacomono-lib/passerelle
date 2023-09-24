import type { Json } from './common'
import type {
  NavigateMessageValue,
  HrefMessageValue,
  SendDataMessage,
  LayoutMetrix,
  MessageKey
} from './message'

export type Event = 'href' | 'navigate' | 'layout' | 'data'

export class CommunicatorHooks {
  #eventMap: Map<Event, Set<Function>> = new Map()

  on(event: 'href', callback: (value: HrefMessageValue) => void): void

  on(event: 'navigate', callback: (value: NavigateMessageValue) => void): void

  on(event: 'layout', callback: (value: LayoutMetrix) => void): void

  on(event: 'data', callback: <T extends Json>(key: MessageKey<T>, value: T) => void): void

  on(event: Event, callback: (...values: any[]) => void): void {
    if (!this.#eventMap.has(event)) {
      this.#eventMap.set(event, new Set())
    }

    this.#eventMap.get(event)?.add(callback)
  }

  off(event: 'href', callback: (value: HrefMessageValue) => void): void

  off(event: 'navigate', callback: (value: NavigateMessageValue) => void): void

  off(event: 'layout', callback: (value: LayoutMetrix) => void): void

  off(
    event: 'data',
    callback: <T extends Json>(key: MessageKey<T>, value: SendDataMessage) => void
  ): void

  off(event: Event, callback: (...values: any[]) => void): void {
    this.#eventMap.get(event)?.delete(callback)
  }

  call(event: 'href', value: HrefMessageValue): void

  call(event: 'navigate', value: NavigateMessageValue): void

  call(event: 'layout', value: LayoutMetrix): void

  call(event: 'data', key: MessageKey<Json>, value: Json): void

  call(event: Event, ...values: any[]): void {
    this.#eventMap.get(event)?.forEach((callback) => callback(...values))
  }

  clear() {
    this.#eventMap.clear()
  }
}
