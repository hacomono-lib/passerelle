import { loggerKey, type Json } from './common'
import {
  isMessage,
  type NavigateMessageValue,
  type HrefMessageValue,
  type MessageKey,
  type Message,
  type SendDataMessage,
  type NavigateMessage,
  type HrefMessage,
  type LayoutMetrix,
  type LayoutMetrixMessage
} from './message'

const loggerFeatureKey = 'core :'

/**
 * Communicate config
 */
export interface CommunicateConfig {
  /**
   * Origin to send messages to
   * @default {string} same origin
   */
  origin?: string

  /**
   *
   * @param value
   * @returns
   */
  onNavigate?(this: Communicator, value: NavigateMessageValue): void

  /**
   *
   * @param value
   * @returns
   */
  onHrefNavigate?(this: Communicator, value: HrefMessageValue): void

  /**
   *
   * @param value
   */
  onUpdateLayout?(this: Communicator, value: LayoutMetrix): void

  /**
   *
   * @param this
   */
  onInit?(this: Communicator): void

  /**
   *
   * @param this
   */
  onDestroy?(this: Communicator): void
}

type ReceiveCallback<T extends Json> = (received: T) => void

function validateConfig({ origin = location.host }: CommunicateConfig) {
  if (origin === '*') {
    console.warn(
      loggerKey,
      loggerFeatureKey,
      'You are using "*" as origin, this is not recommended for security reasons'
    )
  }

  if (isLocalhost(origin)) {
    console.warn(
      loggerKey,
      loggerFeatureKey,
      `You are using an IP address or localhost as origin (${origin}), origin is set to "*"`
    )
  }
}

function isLocalhost(origin: string): boolean {
  return origin.startsWith('localhost:') || /^(\d{1,3}\.){3}\d{1,3}(:\d+)?$/.test(origin)
}

/**
 *
 */
export class Communicator {
  readonly #receivers: Map<string, Array<ReceiveCallback<Json>>> = new Map()

  readonly #senderWindow: Window

  readonly #config: CommunicateConfig

  /**
   *
   * @param senderWindow
   * @param config
   */
  constructor(senderWindow: Window, config: CommunicateConfig) {
    this.#senderWindow = senderWindow
    this.#config = config
    validateConfig(config)

    console.debug(loggerKey, loggerFeatureKey, 'init', config)
    window.addEventListener('message', this.#received)

    config.onInit?.apply(this)
  }

  /**
   *
   */
  destroy() {
    console.debug(loggerKey, loggerFeatureKey, 'destroy')
    window.removeEventListener('message', this.#received)
    this.#config.onDestroy?.apply(this)
  }

  get #origin(): string {
    const host = this.#config.origin ?? location.host

    if (isLocalhost(host)) {
      return '*'
    }

    return host
  }

  #received({ data }: MessageEvent): void {
    if (isMessage(data)) {
      console.debug(loggerKey, loggerFeatureKey, `received [${data.type}]`, data)
      this.#receivedMap[data.type](data as any)
    }
  }

  #receivedMap = {
    data: ({ key, value }: SendDataMessage<Json>) => {
      if (this.#receivers.has(key as string)) {
        const receivers = this.#receivers.get(key as string) as Array<ReceiveCallback<Json>>
        receivers.forEach((receiver) => receiver(value))
      }
    },
    navigate: ({ value }: NavigateMessage) => {
      this.#config.onNavigate?.apply(this, [value])
    },
    href: ({ value }: HrefMessage) => {
      this.#config.onHrefNavigate?.apply(this, [value])
    },
    layout: ({ value }: LayoutMetrixMessage) => {
      this.#config.onUpdateLayout?.apply(this, [value])
    }
  }

  #send(data: Message): void {
    console.debug(loggerKey, loggerFeatureKey, 'send', data)
    this.#senderWindow.postMessage(data, this.#origin)
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
   * @param insider
   */
  sendLayout(insider: LayoutMetrix['insider']): void {
    this.#send({
      type: 'layout',
      value: {
        enclosure: {
          window: {
            width: window.innerWidth,
            height: window.innerHeight
          }
        },
        insider
      }
    })
  }

  /**
   *
   * @param key
   * @param callback
   */
  addReceiver<T extends Json>(key: MessageKey<T>, callback: ReceiveCallback<T>): void {
    this.#receivers.set(
      key as string,
      [...(this.#receivers.get(key as string) ?? []), callback] as Array<ReceiveCallback<Json>>
    )
  }

  /**
   *
   * @param key
   * @param callback
   */
  removeReceiver<T extends Json>(key: MessageKey<T>, callback: (received: T) => void): void {
    const receivers = this.#receivers.get(key as string) as Array<ReceiveCallback<Json>>
    this.#receivers.set(
      key as string,
      receivers.filter((c) => c !== callback)
    )
  }
}
