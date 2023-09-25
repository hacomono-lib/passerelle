import type { Json } from './common'
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

/**
 * Communicate config
 */
export interface CommunicateConfig {
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
   * Called when the communicator is initialized
   * @param this
   */
  onInit?(this: Communicator): void

  /**
   * Called when the communicator is destroyed
   * @param this
   */
  onDestroy?(this: Communicator): void
}

function defaultConfig() {
  return {
    collabRequestTimeout: 1000,
    requireCollab: false,
    origin: location.host
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

const logScope = 'core :'

/**
 *
 */
export class Communicator {
  logPrefix = `[${name}]`

  readonly #senderWindow: Window

  readonly #config: FixedConfig

  readonly #onMessage = this.#received.bind(this)

  readonly #hooks = new CommunicatorHooks()

  /**
   * Event hooks
   * @returns CommunicatorHooks
   */
  get hooks() {
    return this.#hooks
  }

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

    console.debug(this.logPrefix, logScope, 'init', config)
    window.addEventListener('message', this.#onMessage)

    config.onInit?.apply(this)
  }

  /**
   * Destroy the communicator
   */
  destroy() {
    console.debug(this.logPrefix, logScope, 'destroy')
    this.#hooks.clear()
    window.removeEventListener('message', this.#onMessage)
    this.#config.onDestroy?.apply(this)
  }

  /**
   * If the communicator requires collab, it will return true after the collab is completed.
   */
  get isReady(): boolean {
    return this.#config.requireCollab && this.#collaborated
  }

  /**
   * If the communicator initialized ain the iframe, it will return the last layout received from the outside.
   * If not, it will return undefined.
   */
  get lastLayout(): LayoutMetrix | undefined {
    return this.#lastLayout
  }

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
        this.logPrefix,
        logScope,
        'You are using "*" as origin, this is not recommended for security reasons'
      )
    }

    if (isLocalhost(origin)) {
      console.warn(
        this.logPrefix,
        logScope,
        `You are using an IP address or localhost as origin (${origin}), origin is set to "*"`
      )
    }
  }

  #isMessage(value: unknown): value is Message {
    return (
      !!value &&
      typeof value === 'object' &&
      Object.keys(this.#receivedMap).includes((value as Message).type)
    )
  }

  #received({ data }: MessageEvent): void {
    if (this.#isMessage(data) && this.#isAllowedMessage(data)) {
      console.debug(this.logPrefix, logScope, `received [${data.type}]`, data)
      this.#receivedMap[data.type](data as any)
    }
  }

  #receivedMap = {
    data: ({ key, value }: SendDataMessage<Json>) => {
      this.#hooks.call('data', key, value)
    },
    navigate: ({ value }: NavigateMessage) => {
      this.#hooks.call('navigate', value)
    },
    href: ({ value }: HrefMessage) => {
      this.#hooks.call('href', value)
    },
    layout: ({ value }: LayoutMetrixMessage) => {
      this.#lastLayout = value
      this.#hooks.call('layout', value)
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

  #validCollabKey(receivedKey: string | undefined): boolean {
    if (this.#config.requireCollab && !receivedKey) {
      return true
    }

    return this.#config.key === receivedKey
  }

  #isAllowedMessage(message: Message): boolean {
    return message.type === 'collab' || this.isReady
  }

  #send(data: Message): void {
    if (!this.#isAllowedMessage(data)) return

    console.debug(this.logPrefix, logScope, 'send', data)
    this.#senderWindow.postMessage(data, this.#origin)
  }

  /**
   * Send SPA navigation message to the other side
   * @param navigate
   */
  navigate(navigate: NavigateMessageValue): void {
    this.#send({
      type: 'navigate',
      value: navigate
    })
  }

  /**
   * Send location change message to the other side
   * @param href
   */
  href(href: HrefMessageValue): void {
    this.#send({
      type: 'href',
      value: href
    })
  }

  /**
   * Send data to the other side
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
   * Send iframe position and size to the inside
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
   * Request collab
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
