import type { Communicator } from './communicator'

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
   * @default 999
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

export const defaultConfig = {
  collabRequestTimeout: 1000,
  requireCollab: false
  // origin is set in communicator.ts because it depends on browser
} as const satisfies CommunicateConfig
Object.freeze(defaultConfig)

export type FixedConfig = CommunicateConfig & typeof defaultConfig
