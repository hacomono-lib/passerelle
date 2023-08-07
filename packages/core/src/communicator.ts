import { type Json } from './common'
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
  type LayoutMetrixMessage,
  Acknowledge
} from './message'

import { name } from '../package.json'

const loggerFeatureKey = 'core :'

/**
 * Communicate config
 */
export interface CommunicateConfig {
  /**
   *
   */
  logPrefix?: string

  /**
   * Origin to send messages to
   * @default {string} same origin
   */
  origin?: string

  /**
   * A Unique key to be set to ensure that the communication partners across ths iframe are in common context.
   * if not set, context identity is not ensured (ackStrict must be false).
   * @default {undefined}
   */
  key?: string

  /**
   * Timeout for the acknowledge message
   * @default {number} 1000
   */
  ackTimeout?: number

  /**
   * If set to true, enclosure and insider must have the same key.
   * If set to false, allow unset key.
   * @default {boolean} true
   */
  ackStrict?: boolean

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

const defaultConfig = {
  ackTimeout: 1000,
  ackStrict: true,
  origin: location.host,
  logPrefix: `[${name}]`
} as const satisfies CommunicateConfig

type FixedConfig = CommunicateConfig & typeof defaultConfig

type ReceiveCallback<T extends Json> = (received: T) => void

function isLocalhost(origin: string): boolean {
  return origin.startsWith('localhost:') || /^(\d{1,3}\.){3}\d{1,3}(:\d+)?$/.test(origin)
}

function omitNil<T extends Record<string, any>>(obj: T): T {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (value !== undefined && value !== null) {
      acc[key as keyof T] = value
    }
    return acc
  }, {} as T)
}

/**
 *
 */
export class Communicator {
  readonly #receivers: Map<string, Array<ReceiveCallback<Json>>> = new Map()

  readonly #senderWindow: Window

  readonly #config: FixedConfig

  readonly #onMessage = this.#received.bind(this)

  #ackSuccessful: boolean = false

  #ackResolver: (value: boolean) => void = () => {}

  #lastLayout: LayoutMetrix | undefined

  /**
   *
   * @param senderWindow
   * @param config
   */
  constructor(senderWindow: Window, config: CommunicateConfig = {}) {
    this.#senderWindow = senderWindow
    this.#config = {
      ...defaultConfig,
      ...omitNil(config)
    } as FixedConfig
    this.#validateConfig(this.#config)

    console.debug(this.#logPrefix, loggerFeatureKey, 'init', config)
    window.addEventListener('message', this.#onMessage)

    config.onInit?.apply(this)
  }

  /**
   *
   */
  destroy() {
    console.debug(this.#logPrefix, loggerFeatureKey, 'destroy')
    window.removeEventListener('message', this.#onMessage)
    this.#config.onDestroy?.apply(this)
  }

  /**
   *
   */
  get isReady(): boolean {
    return this.#ackSuccessful
  }

  get lastLayout(): LayoutMetrix | undefined {
    return this.#lastLayout
  }

  get #logPrefix(): string {
    return this.#config.logPrefix
  }

  /**
   *
   */
  get #origin(): string {
    const host = this.#config.origin ?? location.host

    if (isLocalhost(host)) {
      return '*'
    }

    return host
  }

  #validateConfig({ origin }: FixedConfig) {
  if (origin === '*') {
    console.warn(
      this.#logPrefix,
      loggerFeatureKey,
      'You are using "*" as origin, this is not recommended for security reasons'
    )
  }

  if (isLocalhost(origin)) {
    console.warn(
      this.#logPrefix,
      loggerFeatureKey,
      `You are using an IP address or localhost as origin (${origin}), origin is set to "*"`
    )
  }

  }


  /**
   *
   * @param param0
   */
  #received({ data }: MessageEvent): void {
    if (isMessage(data) && this.#isAllowedMessage(data)) {
      console.debug(this.#logPrefix, loggerFeatureKey, `received [${data.type}]`, data)
      this.#receivedMap[data.type](data as any)
    }
  }

  /**
   *
   */
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
      this.#lastLayout = value
      this.#config.onUpdateLayout?.apply(this, [value])
    },
    ack: ({ key, comm }: Acknowledge) => {
      this.#ackSuccessful = this.#checkAckKey(key)

      if (comm === 'send' && this.#ackSuccessful) {
        this.#send({
          type: 'ack',
          key: this.#config.key,
          comm: 'receive'
        })
        return
      }

      if (comm === 'receive') {
        this.#ackResolver(this.#ackSuccessful)
        return
      }
    }
  }

  /**
   *
   * @param receivedKey
   */
  #checkAckKey(receivedKey: string | undefined): boolean {
    if (this.#config.ackStrict && !receivedKey) {
      return true
    }

    return this.#config.key === receivedKey
  }

  /**
   *
   * @param message
   */
  #isAllowedMessage(message: Message): boolean {
    return message.type === 'ack' || this.isReady
  }

  /**
   *
   * @param data
   */
  #send(data: Message): void {
    if (!this.#isAllowedMessage(data)) return

    console.debug(this.#logPrefix, loggerFeatureKey, 'send', data)
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


  /**
   *
   */
  async acknowledge(): Promise<boolean> {
    const promise = new Promise<boolean>((resolve) => {
      this.#ackResolver = resolve
      this.#send({ type: 'ack', key: this.#config.key, comm: 'send' })
    })
      .catch(() => false)
      .finally(() => {
        this.#ackResolver = () => {}
      })

    setTimeout(() => {
      this.#ackResolver(false)
    }, this.#config.ackTimeout)

    return promise
  }
}
