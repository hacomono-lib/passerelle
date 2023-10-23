/* eslint-disable max-lines */
import { type Json, logScope, omitNil, isLocalhost, name } from './common'
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
import { type CommunicateConfig, type FixedConfig, defaultConfig } from './config'

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {}

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
  get hooks(): CommunicatorHooks {
    return this.#hooks
  }

  #collaborated = false

  #collabResolver: (value: boolean) => void = noop

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
      ...defaultConfig,
      origin: location.host,
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
  destroy(): void {
    console.debug(this.logPrefix, logScope, 'destroy')
    this.#hooks.clear()
    window.removeEventListener('message', this.#onMessage)
    this.#config.onDestroy?.apply(this)
  }

  /**
   * If the communicator requires collab, it will return true after the collab is completed.
   */
  get isReady(): boolean {
    return !!(this.#config.requireCollab && this.#collaborated)
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
        this.#collabResolver = noop
      })

    setTimeout(() => {
      this.#collabResolver(false)
    }, this.#config.collabRequestTimeout)

    return promise
  }
}
