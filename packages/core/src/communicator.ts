import type { Json } from './common'
import { isMessage } from './message'
import type {
  NavigateMessageValue,
  HrefMessageValue,
  MessageKey,
  Message,
  SendDataMessage,
  NavigateMessage,
  HrefMessage,
  LayoutMetrix,
  LayoutMetrixMessage,
  CollabMessage
} from './message'
import { CommunicatorHooks } from './hooker'

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
   * @default same origin
   */
  origin?: string

  /**
   * A Unique key to be set to ensure that the communication partners across ths iframe are in common context.
   * if not set, context identity is not ensured (ackStrict must be false).
   * @default undefined
   */
  key?: string

  /**
   * Timeout for the collab request
   * @default 1000
   */
  collabRequestTimeout?: number

  /**
   * If set to true, passerelle must exist on both the outside and inside of the iframe, enclosure and insider must have the same key.
   * If set to false, allow unset key.
   * @default false
   */
  requireCollab?: boolean

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

function defaultConfig() {
  return {
    collabRequestTimeout: 1000,
    requireCollab: false,
    origin: location.host,
    logPrefix: `[${name}]`
  } as const satisfies CommunicateConfig
}

type FixedConfig = CommunicateConfig & ReturnType<typeof defaultConfig>

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
  readonly #senderWindow: Window

  readonly #config: FixedConfig

  readonly #onMessage = this.#received.bind(this)

  readonly hooks = new CommunicatorHooks()

  #collaborated: boolean = false

  #collabResolver: (value: boolean) => void = () => {}

  #lastLayout: LayoutMetrix | undefined

  /**
   *
   * @param senderWindow
   * @param config
   */
  constructor(senderWindow: Window, config: CommunicateConfig = {}) {
    if (typeof window === 'undefined') {
      throw new Error('Communicator must be instantiated in the browser.')
    }

    this.#senderWindow = senderWindow
    this.#config = {
      ...defaultConfig(),
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
    this.hooks.clear()
    window.removeEventListener('message', this.#onMessage)
    this.#config.onDestroy?.apply(this)
  }

  /**
   *
   */
  get isReady(): boolean {
    return this.#collaborated
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
      this.hooks.call('data', key, value)
    },
    navigate: ({ value }: NavigateMessage) => {
      this.hooks.call('navigate', value)
    },
    href: ({ value }: HrefMessage) => {
      this.hooks.call('href', value)
    },
    layout: ({ value }: LayoutMetrixMessage) => {
      this.#lastLayout = value
      this.hooks.call('layout', value)
    },
    collab: ({ key, comm }: CollabMessage) => {
      this.#collaborated = this.#validCollabKey(key)

      if (comm === 'send' && this.#collaborated) {
        this.#send({
          type: 'collab',
          key: this.#config.key,
          comm: 'receive'
        })
        return
      }

      if (comm === 'receive') {
        this.#collabResolver(this.#collaborated)
        return
      }
    }
  }

  /**
   *
   * @param receivedKey
   */
  #validCollabKey(receivedKey: string | undefined): boolean {
    if (this.#config.requireCollab && !receivedKey) {
      return true
    }

    return this.#config.key === receivedKey
  }

  /**
   *
   * @param message
   */
  #isAllowedMessage(message: Message): boolean {
    return message.type === 'collab' || this.isReady
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
  sendData<T extends Json>(key: MessageKey<T>, value: T): void {
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
   */
  async requestCollab(): Promise<boolean> {
    if (!this.#config.requireCollab || this.#collaborated) {
      return true
    }

    const promise = new Promise<boolean>((resolve) => {
      this.#collabResolver = resolve
      this.#send({ type: 'collab', key: this.#config.key, comm: 'send' })
    })
      .catch(() => false)
      .finally(() => {
        this.#collabResolver = () => {}
      })

    setTimeout(() => {
      this.#collabResolver(false)
    }, this.#config.collabRequestTimeout)

    return promise
  }
}
