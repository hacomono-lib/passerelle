import type { Json } from './common'
import { isMessage, type NavigateMessageValue, type HrefMessageValue, type MessageKey, type Message, type SendDataMessage, type NavigateMessage, type HrefMessage } from './message'
/**
 * Communicate config
 */
export interface CommunicateConfig {

  /**
   * Origin to send messages to
   * @default {string} same origin
   */
  origin?: string,

  /**
   *
   * @param value
   * @returns
   */
  onNavigate?: (value: NavigateMessageValue) => void,

  /**
   *
   * @param value
   * @returns
   */
  onHrefNavigate?: (value: HrefMessageValue) => void
}

type ReceiveCallback<T extends Json> = (received: T) => void

/**
 *
 */
export class Communicator {
  readonly #receivers: Map<string, Array<ReceiveCallback<Json>>> = new Map()

  /**
   *
   * @param window
   * @param config
   */
  constructor(
    private readonly window: Window,
    private readonly config: CommunicateConfig
  ) {
    this.window.addEventListener('message', this.#onMessage)
  }

  /**
   *
   */
  destroy() {
    this.window.removeEventListener('message', this.#onMessage)
  }

  get #origin(): string {
    return this.config.origin ?? location.host
  }

  #onMessage({ data }: MessageEvent): void {
    if (isMessage(data)) {
      this.#receivedMap[data.type](data as any)
    }
  }

  #receivedMap = {
    data: ({ key, value }: SendDataMessage<Json>) => {
      if (this.#receivers.has(key as string)) {
        const receivers = this.#receivers.get(key as string) as Array<ReceiveCallback<Json>>
        receivers.forEach(receiver => receiver(value))
      }
    },
    navigate: ({ value }: NavigateMessage) => {
      this.config.onNavigate?.(value)
    },
    href: ({ value }: HrefMessage) => {
      this.config.onHrefNavigate?.(value)
    }
  }

  #send(data: Message): void {
    this.window.postMessage(data, this.#origin)
  }


  /**
   *
   * @param value
   */
  navigate(value: NavigateMessageValue): void {
    this.#send({
      type: 'navigate',
      value
    })
  }

  /**
   *
   * @param value
   */
  href(value: HrefMessageValue): void {
    this.#send({
      type: 'href',
      value
    })
  }

  /**
   *
   * @param key
   * @param value
   */
  sendValue<T extends Json>(key: MessageKey<T>, value: T): void {
    this.#send({
      type: 'data',
      key,
      value
    })
  }

  /**
   *
   * @param key
   * @param callback
   */
  addReceiver<T extends Json>(key: MessageKey<T>, callback: ReceiveCallback<T>): void {
    this.#receivers.set(key as string, [
      ...this.#receivers.get(key as string) ?? [],
      callback
    ] as Array<ReceiveCallback<Json>>)
  }

  /**
   *
   * @param key
   * @param callback
   */
  removeReceiver<T extends Json>(key: MessageKey<T>, callback: (received: T) => void): void {
    const receivers = this.#receivers.get(key as string) as Array<ReceiveCallback<Json>>
    this.#receivers.set(key as string, receivers.filter((c) => c !== callback))
  }
}
