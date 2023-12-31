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
  // eslint-disable-next-line @typescript-eslint/ban-types
  readonly #eventMap: Map<Event, Set<Function>> = new Map()

  /**
   *
   * @param event
   * @param callback
   */
  on(event: 'href', callback: (value: HrefMessageValue) => void): void

  /**
   *
   * @param event
   * @param callback
   */
  on(event: 'navigate', callback: (value: NavigateMessageValue) => void): void

  /**
   *
   * @param event
   * @param callback
   */
  on(event: 'layout', callback: (value: LayoutMetrix) => void): void

  /**
   *
   * @param event
   * @param callback
   */
  on(event: 'data', callback: <T extends Json>(key: MessageKey<T>, value: T) => void): void

  /**
   *
   * @param event
   * @param callback
   */
  on(event: 'data', callback: (key: string, value: unknown) => void): void

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  on(event: Event, callback: (...values: any[]) => void): void {
    if (!this.#eventMap.has(event)) {
      this.#eventMap.set(event, new Set())
    }

    this.#eventMap.get(event)?.add(callback)
  }

  /**
   *
   * @param event
   * @param callback
   */
  off(event: 'href', callback: (value: HrefMessageValue) => void): void

  /**
   *
   * @param event
   * @param callback
   */
  off(event: 'navigate', callback: (value: NavigateMessageValue) => void): void

  /**
   *
   * @param event
   * @param callback
   */
  off(event: 'layout', callback: (value: LayoutMetrix) => void): void

  /**
   *
   * @param event
   * @param callback
   */
  off(
    event: 'data',
    callback: <T extends Json>(key: MessageKey<T>, value: SendDataMessage) => void
  ): void

  /**
   *
   * @param event
   * @param callback
   */
  off(event: 'data', callback: (key: string, value: unknown) => void): void

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  off(event: Event, callback: (...values: any[]) => void): void {
    this.#eventMap.get(event)?.delete(callback)
  }

  /**
   *
   * @param event
   * @param value
   */
  call(event: 'href', value: HrefMessageValue): void

  /**
   *
   * @param event
   * @param value
   */
  call(event: 'navigate', value: NavigateMessageValue): void

  /**
   *
   * @param event
   * @param value
   */
  call(event: 'layout', value: LayoutMetrix): void

  /**
   *
   * @param event
   * @param key
   * @param value
   */
  call(event: 'data', key: MessageKey<Json>, value: Json): void

  /**
   *
   * @param event
   * @param key
   * @param value
   */
  call(event: 'data', key: string, value: unknown): void

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  call(event: Event, ...values: any[]): void {
    this.#eventMap.get(event)?.forEach((callback) => callback(...values))
  }

  /**
   *
   */
  clear(): void {
    this.#eventMap.clear()
  }
}
